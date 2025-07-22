'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UploadResult {
  success: boolean;
  message: string;
  updatedJobs?: number;
  errors?: string[];
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">验证登录状态...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // 验证文件类型
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        alert('请上传Excel文件 (.xlsx 或 .xls)');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('请先选择一个Excel文件');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload-jobs', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResult = await response.json();
      setResult(data);
      
      // 如果上传成功，提示用户刷新页面以查看更新后的数据
      if (data.success) {
        setTimeout(() => {
          const refresh = confirm('数据上传成功！是否立即刷新页面以查看更新后的数据？');
          if (refresh) {
            window.location.reload();
          }
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        message: '上传失败：' + (error as Error).message,
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // 创建模板下载链接
    const link = document.createElement('a');
    link.href = '/api/admin/download-template';
    link.download = 'job-template.xlsx';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 头部 */}
        <div className="text-center mb-12 relative">
          <button
            onClick={handleLogout}
            className="absolute top-0 right-0 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1" />
            退出登录
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            管理员后台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            上传Excel文件以批量更新职位数据
          </p>
        </div>

        {/* 模板下载 */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">下载Excel模板</h3>
              <p className="text-gray-600">下载标准模板，按照格式填入您的职位数据</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              下载模板
            </button>
          </div>
        </div>

        {/* 文件上传区域 */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">上传职位数据</h2>
          
          {/* 文件选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择Excel文件
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 
                         file:mr-4 file:py-2 file:px-4 
                         file:rounded-lg file:border-0 
                         file:text-sm file:font-semibold 
                         file:bg-blue-50 file:text-blue-700 
                         hover:file:bg-blue-100 
                         cursor-pointer border border-gray-300 rounded-lg p-3"
              />
            </div>
            {file && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-blue-800">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* 上传按钮 */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              !file || uploading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                处理中...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                上传并更新数据
              </div>
            )}
          </button>
        </div>

        {/* 结果显示 */}
        {result && (
          <div className={`rounded-2xl p-6 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-4">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              )}
              <h3 className={`text-lg font-semibold ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? '上传成功' : '上传失败'}
              </h3>
            </div>
            
            <p className={`mb-4 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.message}
            </p>

            {result.updatedJobs && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">
                  成功更新了 {result.updatedJobs} 个职位
                </p>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">错误详情:</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 说明文档 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Excel文件格式说明</h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>必需列：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>industry (行业): battery, cosmetics, pesticides, pharmaceuticals</li>
              <li>title (职位名称): 职位标题</li>
              <li>company (公司名称): 公司名称</li>
              <li>location (工作地点): 城市或地区</li>
              <li>salary (薪资): 薪资范围</li>
              <li>layer (层级): 对应的产业链层级</li>
              <li>nodeId (节点ID): 对应的产业链节点</li>
              <li>urgency (紧急程度): low, medium, high</li>
            </ul>
            <p className="mt-4"><strong>可选列：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>requirements (职位要求): 用分号(;)分隔多个要求</li>
              <li>responsibilities (工作职责): 用分号(;)分隔多个职责</li>
              <li>link (职位链接): 外部招聘链接</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
