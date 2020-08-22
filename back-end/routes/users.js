const router = require('koa-router')()
const koa2Req = require('koa2-request')
const fs = require("fs-extra")
const path = require("path")
const mime = require("mime")
const tokenTools = require("../utils/tokenTools")
router.prefix('/users')

router.get('/', async function (ctx, next) {
  let data = await httpRequest("get", "http://localhost:9000/users")
  // ctx.set('Cache-Control', 'public, max-age=60')
  ctx.body = {
    status: true,
    data: JSON.parse(data)
  }
})

router.get('/photo', async function (ctx, next) {
  let txtPath = path.resolve(__dirname, "../public/info/1.txt");
  let ifModifiedSince = ctx.request.headers['if-modified-since'];
  //得到文件信息，包括文件更新时间
  let txtInfo = await fs.stat(txtPath)
  let lastModified = txtInfo.mtime.toUTCString()
  console.log("ifModifiedSince", ifModifiedSince)
  console.log("lastModified", lastModified)

  if (ifModifiedSince === lastModified) {
    console.log("未修改，命中缓存")
    ctx.response.status = 304;
  } else {
    ctx.response.lastModified = lastModified;
    console.log("未命中缓存，返回最新数据")
    await responseFile(txtPath, ctx)
  }
})

router.post("/", async (ctx, next) => {
  let token = ctx.headers["self-token"]
  let verifyResult = await tokenTools.verifyToken(token)
  if (verifyResult) {
    let data = await httpRequest("post", "http://localhost:9000/users", ctx.request.body)
    if (data) {
      ctx.body = {
        status: true,
        data
      }
    } else {
      ctx.body = {
        status: false,
        data
      }
    }
  }else{
    ctx.body = {
      status: false,
      msg:"token验证失败无权操作"
    }
  }

})

router.put("/", async (ctx, next) => {
  let data = await httpRequest("put", "http://localhost:9000/users/" + ctx.request.body.id, ctx.request.body)

  if (data) {
    ctx.body = {
      status: true,
      data
    }
  } else {
    ctx.body = {
      status: false,
      data
    }
  }
})

router.delete("/", async (ctx, next) => {
  let data = await httpRequest("delete", "http://localhost:9000/users/" + ctx.request.body.id)
  if (data) {
    ctx.body = {
      status: true,
      data
    }
  } else {
    ctx.body = {
      status: false,
      data
    }
  }
})

const httpRequest = async (method, url, data) => {
  let options = {
    method,
    url,
    json: data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  // 需指定这个参数 否则 在特定的环境下 会引起406错误
    }
  }
  const res = await koa2Req(options)
  return res.body
}


const responseFile = async (path, context, encoding) => {
  const fileContent = await fs.readFile(path, encoding);
  context.type = mime.getType(path);
  context.body = fileContent;
};

module.exports = router
