const router = require('koa-router')()
const fs = require('fs')
const path = require("path")

router.prefix('/files')

router.post("/", async (ctx, next) => {
    let file = ctx.request.files.file
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../public/upload/') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    ctx.body = {
        status:true
    };
})

module.exports = router