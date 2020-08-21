const router = require('koa-router')()


router.prefix('/files')

router.post("/",async (ctx,next)=>{
    console.log(ctx.request.body)
    //空的
    console.log("上传文件了！")
})

module.exports = router