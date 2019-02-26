// const body={
//     name:"fuad",
//     id:"123"
// }
// console.log(body)
// body.createdAt=new Date().getTime()
// console.log(body)


var validate = require('jsonschema').validate;
console.log(validate(4, {"type": "number"}));