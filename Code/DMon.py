from math import ceil

import torch
import torch.nn.functional as F
from torch.nn import Linear
from torch_geometric.nn import DenseGraphConv, DMoNPooling, GCNConv
from torch_geometric.utils import to_dense_adj, to_dense_batch


class DMon(torch.nn.Module):
    def __init__(self, data_args, model_args):
        super().__init__()

        self.in_channels = data_args.num_node_features
        self.out_channels = data_args.num_classes
        self.avg_num_nodes = data_args.avg_num_nodes

        self.hidden_channels = model_args.hidden_channels
        self.mlp_hidden = model_args.mlp_hidden

        self.conv1 = GCNConv(self.in_channels, self.hidden_channels)
        self.conv4 = GCNConv(self.hidden_channels, self.hidden_channels)

        num_nodes = ceil(0.5 * self.avg_num_nodes)
        self.pool1 = DMoNPooling(
            [self.hidden_channels, self.hidden_channels], num_nodes
        )
        self.conv2 = DenseGraphConv(self.hidden_channels, self.hidden_channels)

        num_nodes = ceil(0.5 * num_nodes)
        self.pool2 = DMoNPooling(
            [self.hidden_channels, self.hidden_channels], num_nodes
        )
        self.conv3 = DenseGraphConv(self.hidden_channels, self.hidden_channels)

        num_nodes = ceil(0.5 * num_nodes)
        self.pool3 = DMoNPooling(
            [self.hidden_channels, self.hidden_channels], num_nodes
        )
        self.conv5 = DenseGraphConv(self.hidden_channels, self.hidden_channels)

        self.lin1 = Linear(self.hidden_channels, self.mlp_hidden)
        self.lin2 = Linear(self.mlp_hidden, self.out_channels)

    def forward(self, data):
        x, edge_index, batch = data.x, data.edge_index, data.batch
        edge_weight = getattr(data, 'edge_weight', None)

        x = self.conv1(x, edge_index, edge_weight=edge_weight).relu()

        x, mask = to_dense_batch(x, batch)
        adj = to_dense_adj(edge_index, batch, edge_attr=edge_weight, max_num_nodes=x.size(1))

        _, x, adj, sp1, o1, c1 = self.pool1(x, adj, mask)

        x = self.conv2(x, adj).relu()

        _, x, adj, sp2, o2, c2 = self.pool2(x, adj)

        x = self.conv3(x, adj)

        x = x.mean(dim=1)

        x = self.lin1(x).relu()
        x = self.lin2(x)
        # return F.log_softmax(x, dim=-1), sp1
        return F.softmax(x, dim=-1), sp1

    def update_state_dict(self, state_dict):
        original_state_dict = self.state_dict()
        loaded_state_dict = dict()
        for k, v in state_dict.items():
            if k in original_state_dict.keys():
                loaded_state_dict[k] = v
        self.load_state_dict(loaded_state_dict)