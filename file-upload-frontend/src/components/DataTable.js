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
  DatePicker,
} from "antd";
import axios from "axios";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment"; // Importe moment.js para formatação de data

const { Search } = Input;
const { RangePicker } = DatePicker;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorter, setSorter] = useState({
    field: "updatedAt",
    order: "descend",
  }); // Ordenar por updatedAt, decrescente por padrão
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    olt: [],
    slot: [],
    port: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    olts: [],
    slots: [],
    ports: [],
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dateFilter, setDateFilter] = useState([]);

  useEffect(() => {
    fetchData();
    fetchFilterOptions();
  }, [
    sorter,
    searchText,
    pagination.current,
    pagination.pageSize,
    filters,
    dateFilter,
  ]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/filters");
      setFilterOptions(response.data);
    } catch (error) {
      message.error("Failed to fetch filter options");
    }
  };

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
      fetchData(); // Atualiza os dados após o upload
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
          sortField: sorter.field,
          sortOrder: sorter.order,
          searchText: searchText,
          page: pagination.current,
          pageSize: pagination.pageSize,
          olt: filters.olt,
          slot: filters.slot,
          port: filters.port,
        },
      });

      // Formatar a data para 'dd-mm-aaaa hh-mm-ss'
      const formattedData = response.data.data.map((item) => ({
        ...item,
        updatedAt: moment(item.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
      }));

      setData(formattedData);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    setFilters({
      olt: filters.olt || [],
      slot: filters.slot || [],
      port: filters.port || [],
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/${id}`);
      message.success("Registro excluído com sucesso");
      fetchData(); // Após deletar, atualiza os dados
    } catch (error) {
      message.error("Falha ao excluir registro");
    }
  };

  const handleBatchDelete = async () => {
    try {
      await axios.post("http://localhost:3000/api/data/batch-delete", {
        ids: selectedRowKeys,
      });
      message.success("Registros excluídos com sucesso");
      setSelectedRowKeys([]);
      fetchData(); // Atualiza os dados após a exclusão
    } catch (error) {
      message.error("Falha ao excluir registros");
    }
  };

  const columns = [
    {
      title: "OLT",
      dataIndex: "olt",
      key: "olt",
      sorter: true,
      filters: filterOptions.olts.map((olt) => ({ text: olt, value: olt })),
    },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      sorter: true,
      filters: filterOptions.slots.map((slot) => ({ text: slot, value: slot })),
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      sorter: true,
      filters: filterOptions.ports.map((port) => ({ text: port, value: port })),
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };

  const tableProps = {
    dataSource: data,
    columns: columns,
    rowKey: "id",
    loading: loading,
    onChange: handleTableChange,
    pagination: {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    },
    rowSelection: rowSelection,
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
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            style={{ marginLeft: 0 }}
          >
            Upload
          </Button>
        </Col>
        <Col flex={0}>
          <Button
            type="primary"
            danger
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
            style={{ marginLeft: 0 }}
          >
            Excluir Selecionados
          </Button>
        </Col>
        <Col flex={3}>
          <Search
            placeholder="Buscar registros"
            onSearch={handleSearch}
            style={{ marginBottom: 16, width: "50%", float: "right" }}
          />
        </Col>
      </Row>
      <Table {...tableProps} />
    </>
  );
};

export default DataTable;
