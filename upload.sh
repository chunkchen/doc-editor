#!/usr/bin/env bash
export LANG="en_US.UTF-8"

#----------------------------------------------------------------------
# 常量配置信息
#----------------------------------------------------------------------

# 远程服务器 ip
remote_server_ip='10.50.12.37'
#remote_server_ip='192.68.61.220'
username='root'
# !确保远程文件夹存在
store_dir='/home/jar-project/ai-analysis/front'

#----------------------------------------------------------------------
# 脚本
#----------------------------------------------------------------------
echo '正在打包...'
npm run build
echo '打包完成...'

echo "正在上传..."
scp -r build/* ${username}@${remote_server_ip}:${store_dir}
# shellcheck disable=SC2181
if [ $? != 0 ]; then
  echo "上传失败"
  exit 1
fi
echo "上传成功"
