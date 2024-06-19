'use client';
import Select, { Option, SelectProps } from 'rc-select';
import 'rc-select/assets/index.css';
import './style.css';
import { Badge } from '../ui/badge';
import { XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash-es';

interface MultipleSelectProps extends SelectProps {
  remoteFn?: (keyword: string) => Promise<any[]>;
}

export default function MultipleSelect(props: MultipleSelectProps) {
  const { remoteFn, children, ...restProps } = props;
  const [remoteOptions, setRemoteOptions] = useState<any>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchChange = useCallback(
    debounce(async (keyword: string) => {
      if (!remoteFn) return;
      if (!keyword) {
        setRemoteOptions([]);
        return;
      }
      const options = await remoteFn(keyword);
      setRemoteOptions(options);
    }, 300),
    [],
  );

  return (
    <Select
      className="ui-multiple-select"
      mode="multiple"
      placeholder="请输入"
      tagRender={(props) => {
        return (
          <Badge className="tag-item">
            <span title={`${props.label}`}>{props.label}</span>
            <XIcon
              size={16}
              className="cursor-pointer"
              onClick={() => props.onClose()}
            />
          </Badge>
        );
      }}
      dropdownClassName="ui-multiple-select-dropdown styled-scrollbar"
      showSearch
      dropdownMatchSelectWidth={false}
      onSearch={(value) => onSearchChange(value)}
      maxTagTextLength={10}
      notFoundContent={null}
      {...restProps}
    >
      {!!remoteFn
        ? remoteOptions.map((option: any) => (
            <Option key={option.key} value={option.key}>
              {option.title || option.key}
            </Option>
          ))
        : children}
    </Select>
  );
}
