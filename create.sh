#!/bin/bash

set -euo pipefail

echo "💬 Installing Bun"
curl -fsSL https://bun.sh/install | bash
source /home/node/.bashrc