import { v } from "convex/values";
import{mutation} from "./_generated/server"

export const CreateNewUser=mutation({
    args:{
        name:v.string(),
        email:v.string()
    },
    handler:async(ctx,args)=>{
const user=await ctx.db.query('UserTable')
.filter((q)=>q.eq(q.field('email'),args.email))
.collect()
 
   if(user?.length==0){
        const userData={
            name:args.name,
            email:args?.email,
            token:5000
        }
        const result=await ctx.db.insert('UserTable',userData);
        return userData;
    }
    return user[0]
}

 
})

// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateNewUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Check if user already exists
//     const user = await ctx.db
//       .query("UserTable")
//       .filter((q) => q.eq(q.field("email"), args.email))
//       .collect();

//     if (user.length === 0) {
//       const userData = {
//         name: args.name,
//         email: args.email,
//         token: 5000,
//       };

//       const id = await ctx.db.insert("UserTable", userData);

//       // FIX: Return full user including _id
//       return { _id: id, ...userData };
//     }

//     // Existing user has _id so return it normally
//     return user[0];
//   },
// });


// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateNewUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existing = await ctx.db
//       .query("UserTable")
//       .filter((q) => q.eq(q.field("email"), args.email))
//       .collect();

//     if (existing.length > 0) {
//       return existing[0]; // already has _id
//     }

//     const userData = {
//       name: args.name,
//       email: args.email,
//       token: 5000,
//     };

//     const id = await ctx.db.insert("UserTable", userData);
//     return { _id: id, ...userData };   // IMPORTANT!!!!
//   },
// });
