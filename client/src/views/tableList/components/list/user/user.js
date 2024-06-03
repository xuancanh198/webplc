import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalFun, deatilDataFun } from "../../../../../redux/acction/cmsAcction";
import { toggleStatusRoomType,updateUser,deleteUser ,exportExcelPlan } from "../../../../../service/callAPI/cmsAPI";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Switch from "react-switch";
import {convertTimeFormat} from "../../../../../service/funWeb/funWeb";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Alarm } from '@mui/icons-material';

function RoomType(props) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dataItem, setDataItem] = useState(null);
  const [fullname, setfullname] = useState('');
  const [categoryUser, setcategoryUser] = useState('');
  const [address, setaddress] = useState('');
  const [IsstatusBan, setIsstatusBan] = useState(1);
  const [note, setNote] = useState("");
  const toggelStatus = (id) => {
    confirmAlert({
      title: 'Trạng thái',
      message: 'Bạn có xác nhận xóa người dùng không ?',
      buttons: [
        {
          label: 'Có',
          onClick: () => alert('32131')
        },
        {
          label: 'Không',
          closeOnClickOutside: true
        }
      ]
    });
  }
  const toggleModelData = (data) => {
    setShow(!show);
    if(data){
      setDataItem(data)
      setfullname(data.fullname)
    }
 
  }
  const openModalToggle = (data) => {
    setShow(true)
    if(data){
      setDataItem(data)
      setfullname(data.fullname);
      setNote(data.note)
      setaddress(data.address)
      setIsstatusBan(data.status)
    }
  }
  const updateDataItem=(id)=>{
    const data = {
      fullname:fullname,
      address: address,
      note: note
    }
   const setFunctions = {
      setfullname,
      setNote,
      setaddress,
    };
   dispatch(updateUser(data, setFunctions, toggleModelData,id));
  }
  const toggelDelete = (id) => {
    confirmAlert({
      title: 'Xóa tài khoản người dùng',
      message: 'Bạn có xác nhận xóa tài khoản người dùng không ?',
      buttons: [
        {
          label: 'Có',
          onClick: () => deleteDataItem(id)
        },
        {
          label: 'Không',
          closeOnClickOutside: true
        }
      ]
    });
  }
  const updateStatusUser=(id)=>{
    const value = IsstatusBan === 1 ? 0 :1;
    const data = {
      status:value,
    }
   const setFunctions = {
      setfullname,
      setNote,
      setaddress,
    };
   dispatch(updateUser(data, setFunctions, toggleModelData,id));
  }
  const toggelBanUser = (id) => {
    const action = IsstatusBan === 1 ? 'khóa' : 'mở khóa';
    confirmAlert({
      title: action + " tài khoản người dùng",
      message: "Bạn có xác nhận " + action + " tài khoản người dùng không?",
      buttons: [
        {
          label: 'Có',
          onClick: () => updateStatusUser(id)
        },
        {
          label: 'Không',
          closeOnClickOutside: true
        }
      ]
    });
  }
  

  const deleteDataItem = (id) => {
    dispatch(deleteUser(id));
  }
  const handleChange = (checked) => {
    setIsUpdate(!isUpdate);
    setChecked(checked)
  };
  return (
    <div>
      {show && show === true ?
        <Modal
          show={show}
          onHide={toggleModelData}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{isUpdate && isUpdate === true ? "Cập nhật" : "Xem chi tiết"} thông tin người dùng</Modal.Title>
           </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={() => updateDataItem(dataItem.id)}>
              <Row className="mb-3 flex_center">
                <div className='mt-2 mb-2 row'>
                  <div className='flex_center col-8'>
                    <label>Xem chi tiết</label>
                    <Switch
                      className='toggle-modal'
                      onChange={handleChange}
                      checked={checked}
                    />
                    <label>Cập nhật</label>
                  </div>
                  <div className='flex_center btn-button col-2 m-2' onClick={() => toggelDelete(dataItem.id)}>
                    <i class="fa-solid fa-trash"></i>
                  </div>
                  <div className={`flex_center btn-button col-2 m-2 bg-red ${IsstatusBan === 1 ? 'bd-red' : 'bg-ogren' } `} onClick={() => toggelBanUser(dataItem.id)} >
                    {IsstatusBan === 1 ? <i class="fa-solid fa-toggle-on"></i> : <i class="fa-solid fa-toggle-off"></i> }
                  </div>
                </div>
                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                  <React.Fragment>
                        <div>
                          <Form.Label className='mg-r-20'>Tên đăng nhập: </Form.Label>
                          {dataItem && dataItem !== null ? dataItem.username : "Không có dữ liệu"}
                        </div>
                      </React.Fragment>
                  </Form.Group>
                </div>
                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                    {isUpdate && isUpdate === true ? (
                      <React.Fragment>
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value={fullname}
                          onChange={(e) => setfullname(e.target.value)}
                        />
                        
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div>
                          <Form.Label className='mg-r-20'>Họ và tên: </Form.Label>
                          {dataItem && dataItem !== null ? dataItem.fullname : "Không có dữ liệu"}
                        </div>
                      </React.Fragment>
                    )}

                  </Form.Group>
                </div>
                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                    {console.log(dataItem.address)}
                    {isUpdate && isUpdate === true ? (
                      <React.Fragment>
                        <Form.Label>Địa chỉ </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value={address}
                          onChange={(e) => setaddress(e.target.value)}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div>
                          <Form.Label className='mg-r-20'>Địa chỉ</Form.Label>
                          {dataItem && dataItem !== null ? dataItem.address : "Không có dữ liệu"}
                        </div>
                      </React.Fragment>
                    )}

                  </Form.Group>
                </div>

                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                    {isUpdate && isUpdate === true ? (
                      <React.Fragment>
                        <Form.Label>Ghi chú</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          value=  {note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div>
                          <Form.Label className='mg-r-20'>Ghi chú :</Form.Label>
                          {dataItem && dataItem !== null && dataItem.note !== "" ? dataItem.note : "Không có dữ liệu"}
                        </div>
                      </React.Fragment>
                    )}

                  </Form.Group>
                </div>
                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                    <React.Fragment>
                      <div>
                        <Form.Label className='mg-r-20'>Trạng thái </Form.Label>
                        {dataItem && dataItem !== null ? (
                          dataItem.status === 0 ? (
                            "Bị khóa tài khoản"
                          ) : dataItem.status === 1 ? (
                            "Đang hoạt động"
                          ) : (
                            "Không có dữ liệu"
                          )
                        ) : (
                          "Không có dữ liệu"
                        )}

                      </div>
                    </React.Fragment>
                  </Form.Group>
                </div>
                <div className='mt-2 mb-2'>
                  <Form.Group as={Col} md="12" >
                    <React.Fragment>
                      <div>
                        <Form.Label className='mg-r-20'>Chức vụ :</Form.Label>
                        {dataItem && dataItem !== null ?  dataItem.categoryUser:"Không có dữ liệu"}

                      </div>
                    </React.Fragment>
                  </Form.Group>
                </div>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {isUpdate && isUpdate === true ? (
              <Button type="submit" onClick={() => updateDataItem(dataItem && dataItem !== null && dataItem.id !== null ? dataItem.id : 0)}>Cập nhật</Button>
            ) : (
              null

            )}
            <Button variant="secondary" onClick={toggleModelData}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        : <></>
      }
      <Table
        aria-label="simple table"
        sx={{
          whiteSpace: "nowrap",
          mt: 2
        }}
      >
        <TableHead>
          <TableRow>
            {props.titleHeader && props.titleHeader.map((item, index) => {
              return (
                <TableCell>
                  <Typography>
                    {item}
                  </Typography>
                </TableCell>
              )
            })}


          </TableRow>
        </TableHead>

        {props.products && props.products.length > 0 && props.products.map((items, index) => (
          <TableRow key={items.name}>
            <TableCell>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {index + 1}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {items.username !== null ? items.username : "Không có dữ liệu"}
              </Typography>
            </TableCell>
            <TableCell>

              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {items.fullname !== null ? items.fullname : "Không có dữ liệu"}
              </Typography>
            </TableCell>
            <TableCell>

              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {items.categoryUser !== null ? items.categoryUser : "Không có dữ liệu"}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" fontWeight={400}>
                {items.status === 1 ? "Đang bật" : "Đang tắt"}
              </Typography>
            </TableCell>
            <TableCell >
              <Typography color="textSecondary" fontWeight={400}>
                <div className='flex_center'>
                  <button className='btn-acction-cms bg-org' onClick={() => openModalToggle(items)}>Chi tiết</button>
                </div>
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </Table>

    </div>


  );
}

export default RoomType;
