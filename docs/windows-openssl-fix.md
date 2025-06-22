# Windows OpenSSL 配置错误解决方案

## 问题描述

在 Windows 环境下运行本项目时，可能会遇到以下 OpenSSL 配置错误：

```
OpenSSL configuration error:
[错误代码]:error:80000003:system library:BIO_new_file:No such process:C:\Users\runneradmin\AppData\Local\Temp\pkg.[随机字符串]\node\deps\openssl\openssl\crypto\bio\bss_file.c:67:calling fopen(C:\Program Files\PostgreSQL\psqlODBC\etc\openssl.cnf, rb)
[错误代码]:error:10000080:BIO routines:BIO_new_file:no such file:C:\Users\runneradmin\AppData\Local\Temp\pkg.[随机字符串]\node\deps\openssl\openssl\crypto\bio\bss_file.c:75:
[错误代码]:error:07000072:configuration file routines:def_load:no such file:C:\Users\runneradmin\AppData\Local\Temp\pkg.[随机字符串]\node\deps\openssl\openssl\crypto\conf\conf_def.c:179:
```

## 错误原因

这个错误通常发生在 Windows 系统上，当 Node.js 或相关工具尝试加载 OpenSSL 配置文件时，它会查找一个不存在的配置文件路径（通常指向 PostgreSQL 安装目录）。这是由于：

1. Windows 上没有 OpenSSL 配置文件的标准位置
2. 系统环境变量 `OPENSSL_CONF` 可能指向了错误的路径
3. PostgreSQL 安装可能设置了错误的 OpenSSL 配置路径

## 解决方案

### 方案一：使用批处理文件（推荐）

项目根目录下提供了 `dev.bat` 文件，它会自动设置正确的环境变量并启动开发服务器。

**使用方法：**
```batch
.\dev.bat
```

**批处理文件内容：**
```batch
@echo off
set OPENSSL_CONF=
pnpm exec concurrently "pnpm dev:backend" "pnpm dev:frontend"
```

### 方案二：手动设置环境变量

如果您不想使用批处理文件，可以手动设置环境变量：

**PowerShell：**
```powershell
$env:OPENSSL_CONF=''; pnpm dev
```

**命令提示符：**
```cmd
set OPENSSL_CONF=
pnpm dev
```

### 方案三：永久设置环境变量

您也可以在系统级别永久设置这个环境变量：

1. 打开"系统属性" → "高级" → "环境变量"
2. 在"系统变量"中添加或修改 `OPENSSL_CONF`
3. 将其值设置为空或删除该变量
4. 重启终端或 IDE

## 技术细节

### 尝试过的其他方案

在解决这个问题的过程中，我们尝试了以下方案，但在特定的 Windows + pnpm + concurrently 环境下没有成功：

1. **使用 cross-env 包**：
   - 在各个 package.json 的 dev 脚本中添加 `cross-env OPENSSL_CONF=''`
   - 在根目录的 dev 脚本中设置环境变量
   - 环境变量在多层脚本调用中没有正确传递

2. **修改 tailwind.config.js**：
   - 移除了不存在的路径（`./pages/**/*.{ts,tsx}` 和 `./src/**/*.{ts,tsx}`）
   - 这个修改有助于避免其他构建问题

3. **CSS 选择器问题**：
   - 发现 `postcss-selector-parser@6.1.2` 在解析包含正斜杠的类名（如 `w-1/2`）时存在问题
   - 通过将 `.fullscreen-editor .w-1/2` 改为 `.fullscreen-editor [class~="w-1/2"]` 解决

### 为什么批处理文件方案有效

批处理文件方案之所以有效，是因为：

1. **直接环境控制**：批处理文件在 Windows 原生环境中运行，可以直接控制环境变量
2. **避免多层调用**：不依赖 npm/pnpm 脚本的多层嵌套调用
3. **简单可靠**：使用 Windows 原生的 `set` 命令设置环境变量

## 相关文件

- `/dev.bat` - Windows 开发启动脚本
- `/packages/frontend/app/globals.css` - 修复了 CSS 选择器问题
- `/packages/frontend/tailwind.config.js` - 清理了不存在的路径配置

## 注意事项

1. 这个解决方案主要针对 Windows 环境。在 Linux 或 macOS 上，通常不会遇到这个问题
2. 如果您在其他 IDE 或工具中遇到类似问题，也可以尝试设置 `OPENSSL_CONF` 环境变量为空
3. 确保使用 `pnpm` 而不是 `npm` 来运行项目，因为这是一个 pnpm monorepo 项目

## 更新日志

- **2025-01-21**: 创建文档，记录 Windows OpenSSL 配置错误的完整解决方案 