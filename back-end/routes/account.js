const router = require('koa-router')()
const tokenTools = require("../utils/tokenTools")

router.prefix('/account')

router.post('/login', async (ctx, next) => {
  //body参数ctx.request.body
  if (ctx.get('Authorization') === 'Basic ' + Buffer('admin:123456').toString('base64')) {
    let token =await tokenTools.generateToken("admin")
    ctx.set('Self-Token', token);
    ctx.set('Username', "admin");
    ctx.body = {
      status:true
    }
    // ctx.type = 'text/html'
    ctx.status = 200 
  } else {
    //Basic realm 认证提示
    // ctx.set('WWW-Authenticate','Basic realm="Secure Area"');
    ctx.body = {
      status:false
    }
    ctx.status = 401
  }
  next()
})


module.exports = router
