<?php  
if(isset($_POST['email']) && isset($_POST['password']))
{
    $email=$_POST['email'];
    $password=$_POST['password'];
    $password=base64_decode( $password );
   $realemail="test@test.com"; // which can be retrive from database later.
   $realepass="123456"; // which can be retrive from database later.
   if($email==$realemail && $password==$realepass)
   {
    //$_SESSION['login']='ok';               //setting the session
      echo 1;
   }else
   {
    echo 0;
   }
   
    
}else{
    echo 0;
}





?>