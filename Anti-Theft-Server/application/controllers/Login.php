<?php
/**
 * Created by PhpStorm.
 * User: alessio
 * Date: 01/11/2016
 * Time: 16:29
 */
defined('BASEPATH') OR exit('No direct script access allowed');
class Login extends CI_Controller {

    public function index()
    {
    }

    public function checkLogin()
    {
        $this->load->model("Login_Model","oLoginModel");
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: PUT, GET, POST");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

        $postdata = file_get_contents("php://input");
        if (isset($postdata)) {
            $request = json_decode($postdata);
            if($this->oLoginModel->checkLogin($request->username,$request->password)){
                echo true;
            }else{
                echo false;
            }
        }
    }

    public function registerAccount(){
        $this->load->model("Login_Model","oLoginModel");
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: PUT, GET, POST");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

        $postdata = file_get_contents("php://input");
        if (isset($postdata)) {
            $request = json_decode($postdata);
            if($this->oLoginModel->insertAccount($request->fullname,
                $request->username,
                $request->password,
                $request->email)){
                echo true;
            }else{
                echo false;
            }
        }
    }
}