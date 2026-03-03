#!/bin/bash
find src/modules -name "*.controller.ts" -exec sed -i 's/@Req() req)/@Req() req: any)/g' {} \;
find src/modules -name "*.controller.ts" -exec sed -i 's/@Req() req,/@Req() req: any,/g' {} \;
