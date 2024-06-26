const nodemailer=require("nodemailer")
const {google} =require("googleapis")

const { OAuth2 }=google.auth; // Correct import

const oauth_link="https://developers.google.com/oauthplayground"

const {EMAIL,MAILING_ID,MAILING_REFRESH,MAILING_SECRET}=process.env;


const auth = new OAuth2(MAILING_ID, MAILING_SECRET,MAILING_REFRESH,oauth_link); // Correct instantiation

exports.sendVerficationEmail=async(email,name,url)=>{
    auth.setCredentials({
        refresh_token:MAILING_REFRESH,
    });
    const accessTokens=await auth.getAccessToken();
    const smtp=nodemailer.createTransport({
        service:"gmail",
        auth:{
            type:"OAuth2",
            user:EMAIL,
            clientId:MAILING_ID,
            clientSecret:MAILING_SECRET,
            refreshToken:MAILING_REFRESH,
            accessToken:accessTokens,
        },

    })
    const mailOptions={
        from:EMAIL,
        to:email,
        subject:"Facebook Verification LinkVerify Your Email",
        html:`<div style="max-width:700ox;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:'Courier New',Courier,monospace;font-weight:800;color:#3b5998"><img width="60px" src="https://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19753.png" alt=""><span>Action require: Activate your facebook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#000;font-size:17px"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0;font-weight:500">You recently created an facebook on Facebook. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a></div><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#090f9c">facebook allwos you to stay in touch with all your friends ,once registered on facebook,you can share photos , organize events and much more.</span></div>`
    };
    smtp.sendMail(mailOptions,(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Email sent successfully");
        }
    })
}


