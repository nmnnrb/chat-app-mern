export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
 }


 export const getPic = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
 }


 export const getSenderFull = (loggedUser, users) => {
   return users[0]._id === loggedUser._id ? users[1] : users[0];
 }
 

export const isSameSender = (messages, m, i ,userId) => {

   return(
      i< messages.length -1 && (
         messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined) && messages[i+1].sender._id !== userId
      );
};


export const isLastMessage = (messages, i , userId) => {
   return (
      i === messages.length - 1 && messages[messages.length - 1].sender._id !== userId
   );
}


export const isSameSenderMargin = (messages, m, i, userId) => {
   if (
     i < messages.length - 1 && 
     messages[i + 1]?.sender?._id === m?.sender?._id && 
     m?.sender?._id !== userId
   ) {
     return 33; // Margin for same sender and not the current user
   } else if (
     (i < messages.length - 1 && 
       messages[i + 1]?.sender?._id !== m?.sender?._id && 
       m?.sender?._id !== userId) || 
     (i === messages.length - 1 && 
       m?.sender?._id !== userId)
   ) {
     return 0; // No margin for different sender
   } else {
     return "auto"; // Default margin
   }
 };
 

export const isSameUser = (messages, m, i) => {
   return i >0 && messages[i-1].sender._id === m.sender._id; 
};