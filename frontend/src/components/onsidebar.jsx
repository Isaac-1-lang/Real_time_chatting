// import { Mail } from "lucide-react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import { useEffect } from "react";


// const OnSidebar = () => {
//   const { getmessagesindicator, indicator } = useChatStore();
//   const { onlineUsers = [] } = useAuthStore();


//   useEffect(() => {
//     getmessagesindicator(); 
//     return () => {
//     };
//   }, [getmessagesindicator]); 


//   return (
//     <div className="relative w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
//   <div className=" text-white-500  w-1 h-1 rounded-full flex items-center justify-center text-xs">{indicator}</div>
// </div>

 
//   );
// };

// export default OnSidebar;




// import React from "react";
// import { Bell } from "lucide-react";
// import { useChatStore } from "../store/useChatStore";



// const OnSidebar = () => {
//   const { resetindicator, indicator } = useChatStore();

//   return (
//     <div className="relative" onClick={resetindicator} >
      


      
//      <div className="relative w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
//    <div className=" text-white-500  w-1 h-1 rounded-full flex items-center justify-center text-xs">{indicator}</div>
// </div>


//       <div>
      
//       </div>
//     </div>

//   );
// };

// export default OnSidebar;