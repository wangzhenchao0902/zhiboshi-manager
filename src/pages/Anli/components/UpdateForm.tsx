import React, { useState } from 'react';
import { Form, Select, Button, Input, Modal } from 'antd';

import type { TableListItem } from '../data';
import { InputNumber } from 'antd';
import ImpUploader from '@/components/Uploader/ImageUploader';
import RichEditor from '@/components/RichEditor/RichEditor';

const normFile = (imgUrl: string) => {
  return imgUrl;
};

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};
const FormItem = Form.Item;
const { Option } = Select;

export type UpdateFormState = {
  formVals: FormValueType;
  currentStep: number;
};

const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    title: props.values.title,
    content: props.values.content,
    status: props.values.status,
    order_number: props.values.order_number,
    cover: props.values.cover,
    preview_url: props.values.preview_url,
    category_id: props.values.category_id,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });

    handleUpdate({ ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="title" label="标题" rules={[{ required: true, message: '请输入标题！' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="category_id" label="分类" initialValue={2} rules={[{ required: true }]}>
          <Select style={{ width: 120 }} disabled>
            <Option value={1}>新闻中心</Option>
            <Option value={2}>案例中心</Option>
            <Option value={3}>关于我们</Option>
            <Option value={4}>联系我们</Option>
          </Select>
        </FormItem>
        <FormItem name="tags" label="品牌">
          <Input placeholder="请输入" />
        </FormItem>
        <Form.Item
          name="cover"
          label="封面图"
          valuePropName="fileList"
          getValueProps={() => {
            return { fileList: formVals.preview_url };
          }}
          getValueFromEvent={normFile}
        >
          <ImpUploader></ImpUploader>
        </Form.Item>
        <FormItem name="order_number" label="排序">
          <InputNumber defaultValue={0} />
        </FormItem>
        <FormItem
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容！', min: 5 }]}
        >
          <RichEditor content={formVals.content ? formVals.content : ''} />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={'修改'}
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: formVals.id,
          title: formVals.title,
          content: formVals.content,
          status: formVals.status,
          order_number: formVals.order_number,
          cover: formVals.cover,
          preview_url: formVals.preview_url,
          category_id: formVals.category_id,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
