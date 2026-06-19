// import { Modal, ModalBody, Carousel } from "flowbite-react"
// import google from '../../assets/google.png'
// import mobile from '../../assets/mobile.svg'
// import guitar from '../../assets/guita.png'
// import love from '../../assets/love.png'
// import avatar from '../../assets/avatar.png'
// import close from '../../assets/close.svg'
// import { useState } from "react"
// import { signInWithPopup } from "firebase/auth"
// import { auth, provider, signupWithEmail, loginWithEmail, saveUserToFirestore } from "../Firebase/Firebase"

// const Login = ({ toggleModal, status }) => {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isSignup, setIsSignup] = useState(false);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleGoogleLogin = async () => {
//         try {
//             setLoading(true);
//             const result = await signInWithPopup(auth, provider);
//             await saveUserToFirestore(result.user);

//             toggleModal();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const handleEmailAuth = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             setLoading(true);

//             let user;

//             if (isSignup) {
//                 user = await signupWithEmail(email, password);
//             } else {
//                 user = await loginWithEmail(email, password);
//             }

//             await saveUserToFirestore(user);


//             toggleModal();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div>
//             <Modal
//                 theme={{
//                     "content": {
//                         "base": "relative w-full p-4 md:h-auto",
//                         "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
//                     },
//                 }}
//                 onClick={toggleModal}
//                 className="bg-black rounded-none"
//                 position={'center'}
//                 show={status}
//                 size="md"
//                 popup={true}
//             >
//                 <div onClick={(event) => event.stopPropagation()} className="p-6 pl-2 pr-2 bg-white">
//                     <img
//                         onClick={toggleModal}
//                         className="w-6 absolute z-10 top-4 right-4 cursor-pointer"
//                         src={close}
//                         alt=""
//                     />

//                     <Carousel
//                         slide={false}
//                         theme={{
//                             "indicators": {
//                                 "active": {
//                                     "off": "bg-gray-300",
//                                     "on": "bg-teal-300"
//                                 },
//                                 "base": "h-2 w-2 rounded-full",
//                                 "wrapper": "absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-3"
//                             },
//                             "scrollContainer": {
//                                 "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
//                                 "snap": "snap-x"
//                             },
//                             "control": {
//                                 "base": "inline-flex items-center justify-center bg-transparent",
//                                 "icon": "w-8 text-black dark:text-black"
//                             },
//                         }}
//                         onClick={(event) => { event.stopPropagation() }}
//                         className="w-full h-56 pb-5 rounded-none"
//                     >
//                         <div className="flex flex-col items-center justify-center">
//                             <img className="w-24 pb-5" src={guitar} alt="Slide 1" />
//                             <p style={{ color: '#002f34' }} className="w-60 sm:w-72 text-center pb-5 font-semibold">
//                                 Help us become one of the safest place to buy and sell.
//                             </p>
//                         </div>

//                         <div className="flex flex-col items-center justify-center">
//                             <img className="w-24 pb-5" src={love} alt="Slide 2" />
//                             <p style={{ color: '#002f34' }} className="w-60 sm:w-72 text-center pb-5 font-semibold">
//                                 Close deals from the comfort of your home.
//                             </p>
//                         </div>

//                         <div className="flex flex-col items-center justify-center">
//                             <img className="w-24 pb-5" src={avatar} alt="Slide 3" />
//                             <p style={{ color: '#002f34' }} className="w-60 sm:w-72 text-center pb-5 font-semibold">
//                                 Keep all your favorites in one place.
//                             </p>
//                         </div>
//                     </Carousel>
//                 </div>

//                 <ModalBody
//                     className="bg-white h-auto p-0 rounded-none"
//                     onClick={(event) => { event.stopPropagation() }}
//                 >

//                     <div className="p-6 pt-0">

//                         <div className="flex items-center justify-start rounded-md border-2 border-solid border-black p-5 pl-4 relative h-8 mb-4">
//                             <img className="w-6 mr-2" src={mobile} alt="" />
//                             <p className="text-sm font-bold">Continue with phone</p>
//                         </div>

//                         <div
//                             className="flex items-center justify-center rounded-md border-2 border-solid border-gray-300 p-5 relative h-8 cursor-pointer active:bg-teal-100"
//                             onClick={handleGoogleLogin}
//                         >
//                             <img className="w-7 absolute left-2" src={google} alt="" />
//                             <p className="text-sm text-gray-500">Continue with Google</p>
//                         </div>

//                         <div className="pt-5 flex flex-col items-center justify-center">
//                             <p className="font-semibold text-sm">OR</p>
//                         </div>

//                         <form onSubmit={handleEmailAuth} className="pt-5 flex flex-col gap-3">

//                             <input
//                                 type="email"
//                                 placeholder="Enter Email"
//                                 className="border p-2 rounded-md text-sm"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />

//                             <input
//                                 type="password"
//                                 placeholder="Enter Password"
//                                 className="border p-2 rounded-md text-sm"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />

//                             {error && (
//                                 <p className="text-red-500 text-xs">{error}</p>
//                             )}

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-teal-600 text-white p-2 rounded-md text-sm font-semibold"
//                             >
//                                 {loading
//                                     ? "Please wait..."
//                                     : isSignup
//                                         ? "Signup"
//                                         : "Login"}
//                             </button>

//                         </form>

//                         <div className="pt-4 text-center">
//                             <p
//                                 className="text-sm underline cursor-pointer text-blue-600"
//                                 onClick={() => setIsSignup(!isSignup)}
//                             >
//                                 {isSignup
//                                     ? "Already have an account? Login"
//                                     : "Don't have an account? Signup"}
//                             </p>
//                         </div>

//                         <div className="pt-10 flex flex-col items-center justify-center">
//                             <p className="text-xs">All your personal details are safe with us.</p>
//                             <p className="text-xs pt-5 text-center">
//                                 If you continue, you are accepting
//                                 <span className="text-blue-600"> OLX Terms and Conditions and Privacy Policy</span>
//                             </p>
//                         </div>

//                     </div>

//                 </ModalBody>
//             </Modal>
//         </div>
//     )
// }

// export default Login
