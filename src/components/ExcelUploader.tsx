'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, RefreshCw, Download } from 'lucide-react';

interface UploadResult {
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

export default function ExcelUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadResult({
        success: false,
        message: '请上传Excel文件（.xlsx或.xls格式）'
      });
      return;
    }

    // 验证文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      setUploadResult({
        success: false,
        message: '文件大小不能超过10MB'
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResult = await response.json();
      setUploadResult(result);

      // 如果上传成功，3秒后刷新页面以显示新数据
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

    } catch (error) {
      console.error('上传失败:', error);
      setUploadResult({
        success: false,
        message: '网络错误，上传失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 拖拽处理
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // 点击上传
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    const templateData = [
      {
        '职位名称': '有机合成工程师',
        '公司': '示例制药公司',
        '地点': '上海',
        '薪资': '15-25k',
        '经验要求': '3-5年',
        '学历要求': '硕士',
        '公司规模': 'A轮',
        '行业类型': '制药',
        '岗位要求': '化学相关专业\n熟悉有机合成\n具备实验室经验',
        '工作职责': '负责有机化合物合成\n进行工艺优化\n撰写技术报告',
        '紧急程度': 'medium',
        '链接': 'https://example.com/job/123'
      }
    ];

    // 创建CSV内容
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    // 下载文件
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '职位数据上传模板.csv';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* 标题区域 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
          <FileSpreadsheet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Excel数据上传</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          上传Excel文件，系统将自动识别并分类职位到对应的行业板块
        </p>
      </div>

      {/* 上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : uploadResult?.success
            ? 'border-green-400 bg-green-50'
            : uploadResult && !uploadResult.success
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
            <p className="text-lg font-semibold text-blue-600">正在处理文件...</p>
            <p className="text-sm text-gray-500">请稍候，系统正在解析并分类职位数据</p>
          </div>
        ) : uploadResult ? (
          <div className="space-y-4">
            {uploadResult.success ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-lg font-semibold text-green-600">{uploadResult.message}</p>
                {uploadResult.data && (
                  <div className="bg-white rounded-xl p-4 border border-green-200 max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-800 mb-3">分类结果:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>总职位:</span>
                        <span className="font-medium">{uploadResult.data.totalJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>药物化学:</span>
                        <span className="font-medium">{uploadResult.data.pharmaJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>电池行业:</span>
                        <span className="font-medium">{uploadResult.data.batteryJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>化妆品:</span>
                        <span className="font-medium">{uploadResult.data.cosmeticsJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>农药行业:</span>
                        <span className="font-medium">{uploadResult.data.pesticidesJobs}</span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-500">页面将在3秒后自动刷新以显示新数据</p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-lg font-semibold text-red-600">{uploadResult.message}</p>
                {uploadResult.error && (
                  <p className="text-sm text-gray-500 bg-red-50 p-3 rounded-lg">
                    详细错误: {uploadResult.error}
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                拖拽Excel文件到此处，或点击上传
              </p>
              <p className="text-sm text-gray-500">
                支持 .xlsx 和 .xls 格式，文件大小不超过10MB
              </p>
            </div>
            <button
              onClick={handleClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              选择文件上传
            </button>
          </div>
        )}
      </div>

      {/* 模板下载和说明 */}
      <div className="mt-8 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-800">上传说明</h3>
              <div className="text-sm text-amber-700 space-y-2">
                <p><strong>系统将根据以下字段自动分类职位:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>必填字段:</strong> 职位名称、公司、地点、薪资、岗位要求、工作职责</li>
                  <li><strong>可选字段:</strong> 经验要求、学历要求、公司规模、行业类型、紧急程度、链接</li>
                  <li><strong>分类规则:</strong> 系统会根据职位名称和描述自动识别行业和层级</li>
                  <li><strong>支持格式:</strong> Excel (.xlsx/.xls) 文件</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>下载上传模板</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">
            建议先下载模板查看数据格式要求
          </p>
        </div>
      </div>
    </div>
  );
}
