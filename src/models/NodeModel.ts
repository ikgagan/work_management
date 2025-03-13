import { model, Model, prop, modelAction } from 'mobx-keystone';
import { NodeType } from '../types/models';

@model('businessflow/NodeModel')
export class NodeModel extends Model({
  id: prop<string>(),
  type: prop<NodeType>(),
  label: prop<string>(),
  position: prop<{ x: number; y: number }>(),
  data: prop<Record<string, any>>(() => ({}))
}) {
  @modelAction
  updatePosition(position: { x: number; y: number }) {
    this.position = position;
  }

  @modelAction
  updateLabel(label: string) {
    this.label = label;
  }

  @modelAction
  updateData(data: Record<string, any>) {
    this.data = { ...this.data, ...data };
  }
} 