import React from 'react';
import { Form, Select, Button, Input, Modal } from 'antd';
import { InputNumber } from 'antd';
import ImpUploader from '@/components/Uploader/ImageUploader';
import RichEditor from '@/components/RichEditor/RichEditor';

const FormItem = Form.Item;
const { Option } = Select;

const normFile = (imgUrl: string) => {
  return imgUrl;
};

export type CreateFormProps = {
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  modalVisible: boolean;
};

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { onSubmit: handleCreate, onCancel: handleVisible, modalVisible, onCancel } = props;

  const [form] = Form.useForm();

  const toSubmit = async () => {
    const fieldsValue = await form.validateFields();
    const success = await handleCreate({ ...fieldsValue });
    if (success) {
      form.resetFields();
    }
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleVisible()}>取消</Button>
        <Button type="primary" onClick={() => toSubmit()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={1000}
      destroyOnClose
      title="新建文章"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <FormItem name="title" label="标题" rules={[{ required: true, message: '请输入标题！' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="status" label="状态" initialValue={1} rules={[{ required: true }]}>
          <Select style={{ width: 120 }}>
            <Option value={1}>正常</Option>
            <Option value={2}>关闭</Option>
          </Select>
        </FormItem>
        <FormItem name="category_id" label="分类" initialValue={1} rules={[{ required: true }]}>
          <Select style={{ width: 120 }}>
            <Option value={1}>新闻中心</Option>
            <Option value={2}>案例中心</Option>
            <Option value={3}>关于我们</Option>
            <Option value={4}>联系我们</Option>
          </Select>
        </FormItem>
        <FormItem name="tags" label="品牌">
          <Input placeholder="请输入" />
        </FormItem>
        <Form.Item name="cover" label="封面图" getValueFromEvent={normFile}>
          <ImpUploader></ImpUploader>
        </Form.Item>
        <FormItem name="order_number" label="排序">
          <InputNumber defaultValue={0} />
        </FormItem>
        <FormItem
          name="content"
          label="内容"
          getValueFromEvent={(content) => content}
          rules={[{ required: true, message: '请输入内容！', min: 5 }]}
        >
          <RichEditor content="" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
