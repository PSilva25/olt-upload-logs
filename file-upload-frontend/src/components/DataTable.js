import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Popconfirm,
  Button,
  Input,
  Upload,
  Row,
  Col,
} from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";

const { Search } = Input;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState({});
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [pagination, sorter, searchText]);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Upload realizado com sucesso");
      setFileList([]); // Limpa a lista de arquivos após o upload
    } catch (error) {
      message.error("Falha no upload");
    }
  };

  const props = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Evita o upload automático
    },
    fileList,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/data", {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortField: sorter.field,
          sortOrder: sorter.order,
          searchText: searchText,
        },
      });
      setData(response.data);
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    setSorter(sorter);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/${id}`);
      message.success("Registro excluído com sucesso");
      // Após deletar, atualiza os dados
      fetchData();
    } catch (error) {
      message.error("Falha ao excluir registro");
    }
  };

  const columns = [
    {
      title: "OLT",
      dataIndex: "olt",
      key: "olt",
      sorter: true,
    },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      sorter: true,
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      sorter: true,
    },
    {
      title: "ONT ID",
      dataIndex: "ont_id",
      key: "ont_id",
      sorter: true,
    },
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      sorter: true,
    },
    {
      title: "State",
      dataIndex: "run_state",
      key: "run_state",
      sorter: true,
    },
    {
      title: "Ação",
      key: "action",
      width: 10,
      render: (text, record) => (
        <Popconfirm
          title="Tem certeza que deseja excluir?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sim"
          cancelText="Cancelar"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const tableProps = {
    dataSource: data,
    columns: columns,
    rowKey: "id",
    loading: loading,
    onChange: handleTableChange,
    pagination: pagination,
    bordered: true,
  };

  return (
    <>
      <Row gutter={16}>
        <Col flex={0}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Selecione o arquivo</Button>
          </Upload>
        </Col>
        <Col flex={0}>
          {" "}
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            style={{ marginLeft: 0 }}
          >
            Upload
          </Button>
        </Col>
        <Col flex={3}>
          <Search
            placeholder="Buscar registros"
            onSearch={handleSearch}
            style={{ marginBottom: 16, width: "50%", float: "right"}}
          />
        </Col>
      </Row>
      <Table {...tableProps} />
    </>
  );
};

export default DataTable;
