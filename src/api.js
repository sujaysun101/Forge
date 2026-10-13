export async function readApiResponse(response){
 const contentType=response.headers.get('content-type')||'';
 if(!contentType.includes('application/json')){
  if(response.redirected||response.status===401||response.status===403)throw Error('Your session needs attention. Reload the site and sign in again, then retry your prompt.');
  throw Error('The AI endpoint returned a web page instead of a response. Reload the site and retry. If it persists, the server route needs attention.');
 }
 let data;try{data=await response.json();}catch{throw Error('The server returned an incomplete response. Please retry.');}
 if(!response.ok)throw Error(data.error||'The AI request could not be completed. Please retry.');
 return data;
}
