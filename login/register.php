<?php  
if(isset($_POST['email']) && isset($_POST['password']))
{
    $email=$_POST['email'];
    $password=$_POST['password'];
    $name=$_POST['name'];
    $cell=$_POST['cell'];
    $password=base64_decode( $password );
    //insert all these in database and return status true or false
    $status=true;
   if($status)
   {
    
      echo 1;
   }else
   {
    echo 0;
   }
   
    
}else{
    echo 0;
}





?>