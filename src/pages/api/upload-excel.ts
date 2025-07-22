import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import * as fs from 'fs-extra';
import { parseAndClassifyExcel } from '@/utils/dataClassifier';
import { updateAllIndustryData, backupCurrentData } from '@/utils/dataWriter';

// 禁用Next.js默认的body解析
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    totalJobs: number;
    pharmaJobs: number;
    batteryJobs: number;
    cosmeticsJobs: number;
    pesticidesJobs: number;
    backupLocation?: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '只允许POST请求'
    });
  }

  try {
    // 解析上传的文件
    const form = new IncomingForm({
      uploadDir: './temp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB限制
      filter: (part) => {
        // 只允许Excel文件
        return part.name === 'file' && (
          (part.mimetype?.includes('spreadsheet') || false) ||
          (part.originalFilename?.endsWith('.xlsx') || false) ||
          (part.originalFilename?.endsWith('.xls') || false)
        );
      }
    });

    // 确保临时目录存在
    await fs.ensureDir('./temp');

    const [fields, files] = await form.parse(req);
    
    if (!files.file) {
      return res.status(400).json({
        success: false,
        message: '没有找到上传的文件'
      });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file.filepath) {
      return res.status(400).json({
        success: false,
        message: '文件上传失败'
      });
    }

    // 读取文件内容
    const fileBuffer = await fs.readFile(file.filepath);
    
    // 验证文件不为空
    if (fileBuffer.length === 0) {
      await fs.remove(file.filepath); // 清理临时文件
      return res.status(400).json({
        success: false,
        message: '上传的文件为空'
      });
    }

    // 备份当前数据
    let backupLocation: string | undefined;
    try {
      backupLocation = await backupCurrentData();
    } catch (backupError) {
      console.warn('备份失败，但继续处理:', backupError);
    }

    // 解析并分类Excel数据
    const classifiedData = await parseAndClassifyExcel(fileBuffer);
    
    // 计算统计信息
    const totalJobs = Object.values(classifiedData).reduce((sum, jobs) => sum + jobs.length, 0);
    
    if (totalJobs === 0) {
      await fs.remove(file.filepath); // 清理临时文件
      return res.status(400).json({
        success: false,
        message: 'Excel文件中没有找到有效的职位数据，请检查数据格式'
      });
    }

    // 更新所有行业数据文件
    await updateAllIndustryData(classifiedData);
    
    // 清理临时文件
    await fs.remove(file.filepath);
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      message: `成功处理并分类了 ${totalJobs} 个职位`,
      data: {
        totalJobs,
        pharmaJobs: classifiedData.pharma.length,
        batteryJobs: classifiedData.battery.length,
        cosmeticsJobs: classifiedData.cosmetics.length,
        pesticidesJobs: classifiedData.pesticides.length,
        backupLocation
      }
    });

  } catch (error) {
    console.error('处理Excel上传时出错:', error);
    
    // 清理可能的临时文件
    try {
      const tempFiles = await fs.readdir('./temp');
      for (const tempFile of tempFiles) {
        if (tempFile.endsWith('.xlsx') || tempFile.endsWith('.xls')) {
          await fs.remove(`./temp/${tempFile}`);
        }
      }
    } catch (cleanupError) {
      console.warn('清理临时文件失败:', cleanupError);
    }

    res.status(500).json({
      success: false,
      message: '处理文件时发生错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
}

// 辅助函数：验证Excel文件格式
function validateExcelFile(filename: string): boolean {
  const allowedExtensions = ['.xlsx', '.xls'];
  return allowedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}
