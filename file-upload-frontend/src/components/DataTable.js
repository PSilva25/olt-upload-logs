import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/data");
        setData(response.data);
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: "OLT", dataIndex: "olt", key: "olt" },
    { title: "Slot", dataIndex: "slot", key: "slot" },
    { title: "Port", dataIndex: "port", key: "port" },
    { title: "ONT ID", dataIndex: "ont_id", key: "ont_id" },
    { title: "SN", dataIndex: "sn", key: "sn" },
    { title: "Run State", dataIndex: "run_state", key: "run_state" },
    { title: "Config State", dataIndex: "config_state", key: "config_state" },
    { title: "Match State", dataIndex: "match_state", key: "match_state" },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default DataTable;
