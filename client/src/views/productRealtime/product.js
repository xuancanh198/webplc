import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import {
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getListProduct } from "../../service/callAPI/cmsAPI";
import { useSelector, useDispatch } from 'react-redux';
import {
  getListCmsTable, toggleModalFun, deatilDataFun,
  totalFun, pageFun, limitFun, getProductTable
} from "../../redux/acction/cmsAcction";
import DatePicker from "react-datepicker";
import { convertTimeFormat } from "../../service/funWeb/funWeb";
import "react-datepicker/dist/react-datepicker.css";
import { set } from 'lodash';
import Switch from "react-switch";
function Product() {
  const dispatch = useDispatch();
  const [titleHeader, setTitleHeader] = useState([]);
  const pageNow = useSelector((state) => state.cms.pageNowProduct);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(1);
  const data = useSelector((state) => state.cms.listTableProduct);
  const [latestRecord, setLatestRecord] = useState(null);
  const [searchDate, setSearchDate] = useState(new Date()); // Biến trung gian cho ngày tạo
  const [startFilter, setStartFilter] = useState(new Date()); // Biến trung gian cho ngày bắt đầu
  const [endFilter, setEndFilter] = useState(new Date());
  const [checked, setChecked] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const searchDataCreata_at = (data) => {
    setSearchDate(convertTimeFormat(data))
      dispatch(getListProduct(page, limit, setTotal, convertTimeFormat(data)))
  }
  useEffect(() => {
    if (isStart === true && isEnd === true) {
      dispatch(getListProduct(page, limit, setTotal, null, startFilter, endFilter))
    } 
    else {
      dispatch(getListProduct(page, limit, setTotal, null, null, null))
    }
    setTitleHeader(['STT', 'Thời gian', 'Tổng', 'Sản phẩm 1', 'Sản phẩm 2', 'Sản phẩm 3']);

  }, [startFilter, endFilter, isStart, isEnd]);
  //   useEffect(() => {
  //     const client = new W3CWebSocket('ws://localhost:4000');
  //     client.onopen = () => {
  //         console.log('WebSocket Client Connected');
  //     };
  //     client.onmessage = (message) => {
  //         const dataFromServer = JSON.parse(message.data);
  //         setLatestRecord(dataFromServer);
  //     };
  //     client.onclose = () => {
  //         console.log('WebSocket Client Closed');
  //     };
  //     client.onerror = (error) => {
  //         console.error('Connection Error: ', error);
  //     };
  //     return () => {
  //         client.close();
  //     };
  // }, []);
  const handlePageClick = (event) => {
    const pageNew = event.selected + 1;
    dispatch(getListProduct(pageNew, limit, setTotal))
  };
  const handleChange = (checked) => {
    // setIsUpdate(!isUpdate);
    setChecked(checked);

  };
  const startFilterFun = (data) => {
    if (isStart === false) {
      setIsStart(true);
    }
    setStartFilter(convertTimeFormat(data)); // Cập nhật biến trung gian
  };

  const endFilterFun = (data) => {
    if (isEnd === false) {
      setIsEnd(true);
    }

    setEndFilter(convertTimeFormat(data)); // Cập nhật biến trung gian
  };
  const returnData =()=>{
    dispatch(getListProduct(page, limit, setTotal, null, null, null))
  }
  return (
    <div>
      {/* <div className='flex_center mt-5 mb-5'>
            <h3 className='c-primaryKey css-text-uppercase'>
                Số lượng sản phẩm sản xuất hôm nay
            </h3>
        </div> */}
      {/* <div className=' mt-5 mb-5'>
                 <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12'>
                    <Form.Select aria-label="Default select example">
                        <option disabled selected>Chọn mốc thời gian</option>
                        <option value="1">Hôm nay</option>
                        <option value="2">Hôm qua</option>
                        <option value="3">Tuần này</option>
                        <option value="1">Tuần trước</option>
                        <option value="2">Tháng này</option>
                        <option value="3">Tháng này</option>
                    </Form.Select>
                </div>
        </div> */}
      {/* <div className='row'>
         
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12'>
            <Card className='bg-red card-admin flex_center'>
                <p>Sản phẩm 1</p>
                <Card.Title className='titel-card-admin'>5</Card.Title>
            </Card>
            </div>
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12'>
             <Card className='bg-warning card-admin flex_center'>
            <p>Sản phẩm 2</p>
                <Card.Title className='titel-card-admin'>5</Card.Title>
            </Card>
            </div>
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12'>
            <Card className='bg-blue card-admin flex_center'>
            <p>Sản phẩm 3</p>
                <Card.Title className='titel-card-admin'>5</Card.Title>
            </Card>
            </div>
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12'>
            <Card className='bg-greenYellow card-admin flex_center'>
            <p>Tổng</p>
                <Card.Title className='titel-card-admin'>5</Card.Title>
            </Card>
            </div>
        </div> */}
      <div className='flex_center  mb-5'>
        <h3 className='c-primaryKey css-text-uppercase'>
          Danh sách số lượng sản phẩm sản xuất
        </h3>
      </div>
      <div className='p-5 flex_end'>
        <div className='flex_center mg-10' >
          <i class="fa-solid fa-filter fontCSS" onClick={()=>setIsStatus(!isStatus)}></i>
        </div>
        <div className='flex_center mg-10' onClick={returnData}> 
          <i class="fa-solid fa-rotate-left fontCSS"></i>
        </div>
      </div>

      <div>
        {isStatus === false ? "" :   <div className='row'>
          <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 p-2 flex_center pt-4 pb-4'>
            <lable className="font-label">Lọc</lable>
            <Switch
              className='toggle-modal'
              onChange={handleChange}
              checked={checked}
            />
            <lable className="font-label">Tìm kiếm theo ngày</lable>
          </div>
          {checked === false ?
            <div className='row col-8'>
              <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 p-2'>
                <label className='mb-2'>
                  Ngày bắt đầu :
                </label> <br />
                <DatePicker selected={startFilter} onChange={(date) => startFilterFun(date)} />
              </div>
              <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 p-2'>
                <label className='mb-2'>
                  Ngày kết thúc :
                </label> <br />
                <DatePicker selected={endFilter} onChange={(date) => endFilterFun(date)} />

              </div>
            </div>
            :
            <div className='col-xl-4 col-lg-6 col-md-6 col-sm-12 p-2'>
              <label className='mb-2'>
                Ngày tạo :
              </label> <br />
              <DatePicker selected={searchDate} onChange={(date) => searchDataCreata_at(date)} />
            </div>
          }


        </div>}
      
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2
          }}
        >

          <TableHead>
            <TableRow>
              {titleHeader && titleHeader.map((item, index) => {
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

          {data && data.length > 0 && data.map((items, index) => (
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
                  {convertTimeFormat(items.date_time)}
                </Typography>
              </TableCell>
              <TableCell>

                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  {Number(items.tongphoidauvao)}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography color="textSecondary" fontWeight={400}>
                  {items.sanpham1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" fontWeight={400}>
                  {items.sanpham2}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" fontWeight={400}>
                  {items.sanpham3}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        {Math.ceil(total / limit) > 1 ?
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(total / limit)}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            className='paginate-table'
          />
          : ""}

      </div>
    </div>
  )
}

export default Product
