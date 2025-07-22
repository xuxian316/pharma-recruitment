import { NextResponse } from 'next/server';
import { createExcelFile } from '@/utils/excelHandler';

export async function GET() {
  try {
    // 创建模板数据（基于猎聘Excel格式）
    const templateData = [
      {
        '职位名称': '有机合成工程师',
        '薪资范围': '8-13k',
        '公司名称': '某西安石化公司',
        '工作地点': '西安',
        '经验要求': '1年以上',
        '学历要求': '硕士',
        '公司规模': 'A轮',
        '行业类型': '石化',
        '岗位详情链接': 'https://www.liepin.com/job/example1'
      },
      {
        '职位名称': '药物化学研究员',
        '薪资范围': '30-45k',
        '公司名称': '某重庆化工上市公司', 
        '工作地点': '重庆',
        '经验要求': '5年以上',
        '学历要求': '博士',
        '公司规模': '已上市',
        '行业类型': '化工',
        '岗位详情链接': 'https://www.liepin.com/job/example2'
      },
      {
        '职位名称': '分析化学工程师',
        '薪资范围': '15-25k',
        '公司名称': '某上海生物科技公司',
        '工作地点': '上海-浦东新区',
        '经验要求': '3-5年',
        '学历要求': '统招本科',
        '公司规模': 'B轮',
        '行业类型': '生物技术',
        '岗位详情链接': 'https://www.liepin.com/job/example3'
      }
    ];

    // 创建Excel文件
    const excelBuffer = await createExcelFile(templateData, 'JobTemplate');

    // 返回Excel文件
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="job-template.xlsx"',
      },
    });
  } catch (error) {
    console.error('生成模板失败:', error);
    return NextResponse.json(
      { error: '生成模板失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
