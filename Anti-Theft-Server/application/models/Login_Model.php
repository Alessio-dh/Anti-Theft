<?php
/**
 * Created by PhpStorm.
 * User: alessio
 * Date: 03/11/2016
 * Time: 13:51
 */

class Login_Model extends CI_Model {
    public function CheckLogin($username,$password){
        try{
            $this->load->database();
            $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
            $query = $this->db->query($sql, array($username,$password));

            foreach ($query->result_array() as $row)
            {
                return true;
            }
        }catch(Exception $e){
            return false;
        }
    }

    public function insertAccount($fullname,$username,$password,$email)
    {
        try {
            $this->load->database();
            $sql = "INSERT INTO users (ID,Fullname,Username,Password,Email) VALUES(?,?,?,?,?)";
            $ID = $this->getHighestID();
            if($this->db->query($sql, array($ID, $fullname, $username, $password, $email))){
                return true;
            }else{
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    private function getHighestID(){
        try{
            $this->load->database();
            $sql = "SELECT MAX(ID) FROM users";
            $query = $this->db->query($sql);
            $id= $query->result_array();
            $id2 = (int)$id[0]['MAX(ID)'] +1 ;
            return $id2;
        }catch(Exception $e){
            return false;
        }
    }
}