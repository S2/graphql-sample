import {Books} from './GraphQL/Queries'
import {multipleQuery} from "./GraphQL"

console.log("11111111111111")
async function hoge(){
  console.log("aaaaaaaaaaaaaa")
  const state = await multipleQuery((e) => {
    } , new Books(
      {} ,
      [
        "title" , 
        "author" , 
      ]
    )
  )
  
  console.log("bbbbbbbbbbbbbb")
  console.log(state)
}

console.log("22222222222222")
hoge();
console.log("33333333333333")
