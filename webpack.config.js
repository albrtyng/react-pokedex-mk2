const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /\.gif/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        include: [path.resolve(__dirname, 'src/styles'), path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.(png|jpg|gif|svg|css|eot|ttf)$/,
        loader: 'url-loader',
        include: [path.resolve(__dirname, 'src/assets')]
      }
    ]
  },
  output: {
    publicPath: 'public',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}