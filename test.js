import dot from 'dot-object'

let js = {pop:{
	dad:{
  	child:{
    	eyes:"green",
      hair:"blue"
    },
    eyes:'black'
  },
  hair:'bald'
}}

console.log(dot.dot(js))