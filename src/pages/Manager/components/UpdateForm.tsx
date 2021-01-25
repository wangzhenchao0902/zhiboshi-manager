import React, { useState } from 'react';
import { Form, Button, Input, Modal } from 'antd';

import type { TableListItem } from '../data.d';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

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
    name: props.values.name,
    realname: props.values.realname,
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
        <FormItem
          // name="name"
          label="用户名"
        >
          <Input disabled value={formVals.name} placeholder="请输入" />
        </FormItem>
        <FormItem name="realname" label="姓名">
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          hasFeedback
          rules={[{ min: 6, message: '最少6位长度密码' }]}
        >
          <Input.Password
            placeholder="请输入"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </FormItem>
        <FormItem
          name="confirm_assword"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator: async (_, value) => {
                if (getFieldValue('password') !== value) {
                  throw new Error('两次输入密码不一致!');
                }
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请输入"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
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
      width={600}
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
          name: formVals.name,
          realname: formVals.realname,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
