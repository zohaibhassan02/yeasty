// import { NextApiRequest, NextApiResponse } from 'next';
// import { productCreation, getUserProductsByCategory, getAllUserProducts, setProductStatus, findItemById, deleteItemById, generateLinkForActiveProducts, generateQRCodeForLink, getActiveProductsByCategory, generateQRCodePDF, updateProductItem, reorderProducts, liveSearch } from '@/backend/Controller/ProductController';
// import { authCheck } from '@/backend/Middleware/Auth';
// import { connect } from '@/backend/database/dbConfig';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (!req.url) {
//       res.status(400).json({ message: 'Invalid request' });
//       return;
//     }

//     await connect();
  
//     const path = req.url.split('?')[0];
  
//     switch (req.method) {
//         case 'POST':
//           if (path.endsWith('/productCreate')) {
//             await authCheck(productCreation)(req, res);
//           } else if (path.endsWith('/getUserProductsByCategory')) {
//             await authCheck(getUserProductsByCategory)(req, res);
//           } else if (path.endsWith('/getAllUserProducts')) {
//             await authCheck(getAllUserProducts)(req, res);
//           } else if (path.endsWith('/findItemById')) {
//             await authCheck(findItemById)(req, res);
//           } else if (path.endsWith('/generateQRCodeForLink')) {
//             await authCheck(generateQRCodeForLink)(req, res);
//           } else if (path.endsWith('/generateQRCodePDF')) {
//             await authCheck(generateQRCodePDF)(req, res);
//           } else if (path.endsWith('/liveSearch')) {
//             await authCheck(liveSearch)(req, res);
//           }
//           break;
//         case 'PUT':
//           if (path.endsWith('/setProductStatus')) {
//             await authCheck(setProductStatus)(req, res);
//           } else if (path.endsWith('/updateProductItem')) {
//             await authCheck(updateProductItem)(req, res);
//           } else if (path.endsWith('/reorderProducts')) {
//             await authCheck(reorderProducts)(req, res);
//           }
//           break;
//         case 'DELETE':
//           if (path.endsWith('/deleteItemById')) {
//             await authCheck(deleteItemById)(req, res);
//           }
//           break;
//         case 'GET':
//           if (path.endsWith('/generateLinkForActiveProducts')) {
//             await authCheck(generateLinkForActiveProducts)(req, res);
//           } else if (path.endsWith('/active')) {
//             await authCheck(getActiveProductsByCategory)(req, res);
//           }
//           break;
//         default:
//           res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
//           res.status(405).end(`Method ${req.method} Not Allowed`);
//       }
// }


// import { userSignUp, userSignIn, userSignOut, userEditProfile, requestPasswordReset, resetPassword, changePassword, inviteSubUser, toggleSubUserStatus, getUserInfo, verifyToken } from '@/backend/Controller/UserAuthController';
// import { authCheck } from '@/backend/Middleware/Auth';
// import { connect } from '@/backend/database/dbConfig';
// import { NextResponse, NextRequest } from 'next/server';

// console.log("WOWOWWW")

// export async function POST(req: NextRequest) {
//     console.log("hello world")
//     await connect();
  
//     const path = req.url?.split('?')[0];
//     console.log(req.url)
//     console.log(path)
  
//     if (path?.endsWith('/userSignUp')) {
//       await userSignUp(req);
//     } else if (path?.endsWith('/userSignIn')) {
//         console.log("wowww")
//       await userSignIn(req);
//     } else if (path?.endsWith('/userSignOut')) {
//       await userSignOut(req);
//     } else if (path?.endsWith('/requestPasswordReset')) {
//       await requestPasswordReset(req);
//     } else if (path?.endsWith('/inviteSubUser')) {
//       await authCheck(inviteSubUser)(req);
//     } else if (path?.endsWith('/getUserInfo')) {
//       await authCheck(getUserInfo)(req);
//     } else if (path?.endsWith('/verifyToken')) {
//       await verifyToken(req);
//     } else {
//         console.log("wow")
//     //   res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   }
