import React from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const FormItem = Form.Item;

export type CreateFormProps = {
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  modalVisible: boolean;
};

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
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
      width={600}
      destroyOnClose
      title="修改密码"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <FormItem
          name="name"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem name="realname" label="姓名">
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          hasFeedback
          rules={[
            { required: true, message: '请输入密码！' },
            { min: 6, message: '最少6位长度密码' },
          ]}
        >
          <Input.Password
            placeholder="请输入"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </FormItem>
        <FormItem
          // name="confirm_assword"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
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
      </Form>
    </Modal>
  );
};

export default CreateForm;
