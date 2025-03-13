import { model, Model, prop, modelAction } from 'mobx-keystone';
import type { EdgeType } from '../types/models';

@model('businessflow/EdgeModel')
export class EdgeModel extends Model({
  id: prop<string>(),
  source: prop<string>(),
  target: prop<string>(),
  label: prop<string>(),
  type: prop<EdgeType>(() => 'default')
}) {
  @modelAction
  updateLabel(label: string) {
    this.label = label;
  }

  @modelAction
  updateType(type: EdgeType) {
    this.type = type;
  }
} 