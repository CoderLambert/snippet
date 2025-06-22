@echo off
set OPENSSL_CONF=
pnpm exec concurrently "pnpm dev:backend" "pnpm dev:frontend" 