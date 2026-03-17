const handleChangeData = (data) => {
  Data.skuTableData = data
  const salePrices = []
  const marketPrices = []
  let totalStock = 0
  Data.skuTableData?.forEach((sku, idx) => {
    if (!sku.marketPriceFee) {
      sku.marketPriceFee = 0
    }
    if (sku.stock) {
      totalStock += Number(sku.stock) // 库存累加
    }
    salePrices.push(sku.priceFee) // 售价
    marketPrices.push(sku.marketPriceFee) // 市场价
  })
  if (Data.dataForm.skus) {
    Data.dataForm.skus.forEach(() => {
      Data.dataForm.changeStock = totalStock - Data.backTotalStock
    })
  }
  Data.dataForm.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  Data.dataForm.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  Data.dataForm.totalStock = totalStock // 总库存
}
