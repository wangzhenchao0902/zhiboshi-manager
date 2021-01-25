import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import './index.less';
import { Upload } from './service';

type RichEditorProps = {
  content: string;
  onChange?: (e: any) => void;
};

class RichEditor extends React.Component<RichEditorProps> {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(this.props.content),
  };

  handleEditorChange = (editorState: any) => {
    this.setState({ editorState });
    if (this.props.onChange) {
      this.props.onChange(this.state.editorState.toHTML());
    }
  };
  test = async (param: any) => {
    const res = await Upload(param.file);
    param.progress(100);

    param.success({
      url: res.preview_url,
      meta: {
        loop: true, // 指定音视频是否循环播放
        autoPlay: true, // 指定音视频是否自动播放
        controls: true, // 指定音视频是否显示控制栏
      },
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="my-component">
        <BraftEditor
          media={{ uploadFn: this.test }}
          value={editorState}
          onChange={this.handleEditorChange}
          // onSave={this.submitContent}
        />
      </div>
    );
  }
}

export default RichEditor;
