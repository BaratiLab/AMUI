import torch
import torch.nn.functional as F
from torch import nn
import numpy as np


# Helper Functions:
def norm_layer(norm, c):
    print("norm")
    return nn.BatchNorm3d(c) if norm else nn.Sequential()


def upsample(
    c_in, c_out, up_kwargs, conv_kwargs, act=nn.LeakyReLU, num_convs=0, norm=False
):
    print("upsample")
    if "mode" in up_kwargs:
        layers = [
            nn.Upsample(**up_kwargs),
            nn.Conv3d(c_in, c_out, stride=1, padding="same", **conv_kwargs),
        ]

    else:
        layers = [nn.ConvTranspose3d(c_in, c_out, **up_kwargs)]

    layers += [norm_layer(norm, c_out), act()]

    for i in range(num_convs):
        layers += [
            nn.Conv3d(c_out, c_out, stride=1, padding="same", **conv_kwargs),
            norm_layer(norm, c_out),
            act(),
        ]
    return nn.Sequential(*layers)


# Main Generator Class
class Generator3d(nn.Module):
    def __init__(
        self,
        shape=(128, 32, 64),
        input_size=3,
        fc_hiddens=[],
        channels=[256, 128, 64, 32, 16, 8],
        up_kwargs=dict(scale_factor=2, mode="trilinear", align_corners=False),
        act=nn.LeakyReLU,
        conv_kwargs=dict(kernel_size=3),
        num_convs=0,
        out_conv_kwargs=dict(kernel_size=3),
        norm=False,
        slices=3 * [slice(None, None)],
    ):
        print("__init__")

        super().__init__()
        self.slice_x, self.slice_y, self.slice_z = slices
        #######################################################################
        cd = 2 ** (len(channels) - 1)
        c1 = channels[0] if channels else 1
        d1, d2, d3 = shape
        self.start_shape = (c1, d1 // cd, d2 // cd, d3 // cd)

        fc_layers = []
        fc_units = [input_size] + fc_hiddens + [np.prod(self.start_shape)]
        for i in range(len(fc_units) - 1):
            fc_layers += [nn.Linear(fc_units[i], fc_units[i + 1]), act()]
        self.fcn = nn.Sequential(*fc_layers)
        #######################################################################
        conv_layers = []
        for i in range(len(channels) - 1):
            conv_layers += [
                upsample(
                    channels[i],
                    channels[i + 1],
                    up_kwargs,
                    conv_kwargs,
                    act,
                    num_convs,
                    norm,
                )
            ]
        conv_layers += [
            nn.Conv3d(
                channels[-1],
                1,
                stride=1,
                padding="same",
                padding_mode="replicate",
                **out_conv_kwargs
            )
        ]
        self.cnn = nn.Sequential(*conv_layers)

    def forward(self, u, mask=False):
        x = self.fcn(u).reshape(u.shape[0], *self.start_shape)
        x = self.cnn(x)
        x = x[:, :, self.slice_x, self.slice_y, self.slice_z]
        if mask:
            return torch.sigmoid(x)
        return F.leaky_relu(x, 0.001 if self.training else 0)
