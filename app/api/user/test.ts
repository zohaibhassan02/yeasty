// import { NextApiRequest, NextApiResponse } from 'next';
// import { userSignUp, userSignIn, userSignOut, userEditProfile, requestPasswordReset, resetPassword, changePassword, inviteSubUser, toggleSubUserStatus, getUserInfo, verifyToken } from '@/backend/Controller/UserAuthController';
// import { authCheck } from '@/backend/Middleware/Auth';
// import { connect } from '@/backend/database/dbConfig';

// console.log("WOWOWWW")

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     console.log("hello world")
//     await connect();
  
//     const path = req.url?.split('?')[0];
//     console.log(req.url)
//     console.log(path)
  
//     if (path?.endsWith('/userSignUp')) {
//       await userSignUp(req, res);
//     } else if (path?.endsWith('/userSignIn')) {
//         console.log("wowww")
//       await userSignIn(req, res);
//     } else if (path?.endsWith('/userSignOut')) {
//       await userSignOut(req, res);
//     } else if (path?.endsWith('/requestPasswordReset')) {
//       await requestPasswordReset(req, res);
//     } else if (path?.endsWith('/inviteSubUser')) {
//       await authCheck(inviteSubUser)(req, res);
//     } else if (path?.endsWith('/getUserInfo')) {
//       await authCheck(getUserInfo)(req, res);
//     } else if (path?.endsWith('/verifyToken')) {
//       await verifyToken(req, res);
//     } else {
//       res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   }
  
//   export async function PUT(req: NextApiRequest, res: NextApiResponse) {
//     await connect();
  
//     const path = req.url?.split('?')[0];
  
//     if (path?.endsWith('/resetPassword')) {
//       await resetPassword(req, res);
//     } else if (path?.endsWith('/userEditProfile')) {
//       await authCheck(userEditProfile)(req, res);
//     } else if (path?.endsWith('/changePassword')) {
//       await authCheck(changePassword)(req, res);
//     } else if (path?.endsWith('/toggleSubUserStatus')) {
//       await authCheck(toggleSubUserStatus)(req, res);
//     } else {
//       res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   }


// import { userSignUp, userSignIn, userSignOut, userEditProfile, requestPasswordReset, resetPassword, changePassword, inviteSubUser, toggleSubUserStatus, getUserInfo, verifyToken } from '@/backend/Controller/UserAuthController';
// import { authCheck } from '@/backend/Middleware/Auth';
// import { connect } from '@/backend/database/dbConfig';
// import { Bodoni_Moda } from 'next/font/google';
// import { NextResponse, NextRequest } from 'next/server';
// // import { cookies } from 'next/headers'; // Import cookies

// console.log("WOWOWWW")

// // const cookieStore = cookies();
// // export async function GET(req: NextRequest) {

// //     await connect();
  
// //     return NextResponse.json({ status: 400, message: 'Method Not Allowed'});
// // }
    

// export async function POST(request: NextRequest) {

//   try{
//   await connect();

//   const path = request.url?.split('?')[0];
//   let res = NextResponse;
//   let reqq;
//   try {
//     reqq = await request.json();
//   } catch (error) {
//     reqq = {};
//   }

//   // console.log(reqq);

//   let query = new URLSearchParams(request.url)

//   // query = query.get('whats')

//   const cookie = request.cookies.get('token');

// //   let cookies = {};
// //   if(cookie){
// //    cookies = {
// //       token: cookie.value,
// //     }
// //   }
// //   else {
// //     cookies = {
// //       token: null,
// //   }
// // }
//   const req = {
//     body:reqq,
//     query: query,
//     userId: reqq.userId,
//     userType: reqq.userType,
//     cookies: cookie,
//   }


//   // console.log("WORLDDDD")
//   // const query = new URL(request.url);
//   // console.log(query);
//   // console.log(query.searchParams.get('whats'))
//   // console.log(request.url.searchParams.get('what'));
//   // console.log(req);
//   // console.log(req.body);
//   // console.log(req.email);
//   // console.log(req.params);

// let result = {};
//   if (path?.endsWith('/userSignUp')) {
//     result = await userSignUp(req, res);
//   } else if (path?.endsWith('/userSignIn')) {
//     result =  await userSignIn(req, res);
//   } else if (path?.endsWith('/userSignOut')) {
//     result = await userSignOut(req, res);

//     console.log(result);
//   } else if (path?.endsWith('/requestPasswordReset')) {
//     result = await requestPasswordReset(req, res);
//   } else if (path?.endsWith('/inviteSubUser')) {
//     result = await authCheck(inviteSubUser)(req, res);
//   } else if (path?.endsWith('/getUserInfo')) {
//     result = await authCheck(getUserInfo)(req, res);
//   } else if (path?.endsWith('/verifyToken')) {
//     // console.log("verifyToken")
//     result = await verifyToken(req, res);
//   } else {
//     result = { message: 'Method Not Allowed' };
//   }

//   return NextResponse.json(result);
//   // if (res && res.error) {
//   //   return NextResponse.json(res, { status: 400 });
//   // }

//   // return NextResponse.json(res);
// }catch(error){
//   console.log(error)
// }
// }
  
//   export async function PUT(req: NextApiRequest, res: NextApiResponse) {
//     await connect();
  
//     const path = req.url?.split('?')[0];
  
//     if (path?.endsWith('/resetPassword')) {
//       await resetPassword(req, res);
//     } else if (path?.endsWith('/userEditProfile')) {
//       await authCheck(userEditProfile)(req, res);
//     } else if (path?.endsWith('/changePassword')) {
//       await authCheck(changePassword)(req, res);
//     } else if (path?.endsWith('/toggleSubUserStatus')) {
//       await authCheck(toggleSubUserStatus)(req, res);
//     } else {
//       res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   }




