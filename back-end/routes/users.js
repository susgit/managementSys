const router = require('koa-router')()
const koa2Req = require('koa2-request')

router.prefix('/users')

router.get('/', async function (ctx, next) {
  let data = await httpRequest("get","http://localhost:9000/users")
  // console.log("get请求回：",data)//返回请求数据
  ctx.body = {
    status:true,
    data:JSON.parse(data)
  }
})

router.post("/",async (ctx, next)=>{
  // console.log(ctx.request.body)
  let data = await httpRequest("post","http://localhost:9000/users",ctx.request.body)
  // console.log("请求回：",data)//返回添加的数组
  if(data){
    ctx.body = {
      status:true,
      data
    }
  }else{
    ctx.body = {
      status:false,
      data
    }
  }
})

router.put("/",async (ctx, next)=>{
  // console.log(ctx.request.body)
  let data = await httpRequest("put","http://localhost:9000/users/"+ctx.request.body.id,ctx.request.body)
  // console.log("put请求回：",data)//返回修改的数组
  if(data){
    ctx.body = {
      status:true,
      data
    }
  }else{
    ctx.body = {
      status:false,
      data
    }
  }
})

router.delete("/",async (ctx, next)=>{
  let data = await httpRequest("delete","http://localhost:9000/users/"+ctx.request.body.id)
  // console.log("delete请求回",data)//请求回空数组
  if(data){
    ctx.body = {
      status:true,
      data
    }
  }else{
    ctx.body = {
      status:false,
      data
    }
  }
})

const httpRequest = async (method,url,data) => {
  let options = {
    method,
    url,
    json:data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  // 需指定这个参数 否则 在特定的环境下 会引起406错误
    }
  }
  //
  const res = await koa2Req(options)
  // console.log("res.body",res.body)
  return res.body 


}

module.exports = router
