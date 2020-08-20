const router = require('koa-router')()

router.prefix('/account')

router.get('/', async (ctx, next) => {
  await ctx.render('', {
    title: 'Hello Koa 2fhdfjladhf'
  })
})

router.post('/login', async (ctx, next) => {
  //body参数ctx.request.body
  if (ctx.get('Authorization') === 'Basic ' + Buffer('admin:123456').toString('base64')) {
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

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
