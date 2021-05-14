import React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

type UploadProps = {
  fileList?: [];
  onChange?: (e: any) => void;
};

class ImgUploader extends React.Component<UploadProps, { loading: boolean; fileList: any }> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      fileList: this.props.fileList
        ? [
            {
              url: this.props.fileList,
            },
          ]
        : [],
    };
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // trigger parent event
      if (info.file.response.result === true) {
        this.setState({
          loading: false,
          fileList: [{ url: info.file.response.data.preview_url }],
        });

        if (this.props.onChange) {
          this.props.onChange(info.file.response.data.file_path);
        }
      }
    }
  };

  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          fileList={this.state.fileList}
          action="api/manager/upload"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Alert message="" description="300 * 300，小于2M，jpg或者png" showIcon type="warning" />
      </>
    );
  }
}

export default ImgUploader;
