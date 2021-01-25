import React from 'react';
import { Switch } from 'antd';

type SwitchProps = {
  onChange: (checked: boolean) => Promise<boolean>;
  checked: boolean;
};

class TableSwitch extends React.Component<SwitchProps, { isChecked: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      isChecked: this.props.checked,
    };
  }

  handleChange = async (checked: boolean) => {
    const success = await this.props.onChange(checked);
    if (success) {
      this.setState({ isChecked: !this.state.isChecked });
    }
  };

  render() {
    return (
      <>
        <Switch
          checked={this.state.isChecked}
          onChange={(checked) => {
            this.handleChange(checked);
          }}
        ></Switch>
      </>
    );
  }
}

export default TableSwitch;
