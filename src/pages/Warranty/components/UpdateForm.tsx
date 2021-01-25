import React, { useState } from 'react';
import { Form, Button, Input, DatePicker, Modal } from 'antd';

import type { TableListItem } from '../data.d';
import moment from 'moment';

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
    status: props.values.status,
    phone: props.values.phone,
    start_at: props.values.start_at,
    end_at: props.values.end_at,
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

    fieldsValue.start_at = moment(fieldsValue.start_at).format('YYYY-MM-DD HH:mm:ss');
    fieldsValue.end_at = moment(fieldsValue.end_at).format('YYYY-MM-DD HH:mm:ss');

    handleUpdate({ ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="name" label="姓名">
          <Input disabled value={formVals.name} placeholder="请输入" />
        </FormItem>
        <FormItem name="phone" label="手机号">
          <Input disabled value={formVals.phone} placeholder="请输入" />
        </FormItem>
        <FormItem name="start_at" label="开始时间" rules={[{ required: true }]}>
          <DatePicker showTime />
        </FormItem>
        <FormItem name="end_at" label="结束时间" rules={[{ required: true }]}>
          <DatePicker showTime />
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
          status: formVals.status,
          phone: formVals.phone,
          start_at: moment(formVals.start_at),
          end_at: moment(formVals.end_at),
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
