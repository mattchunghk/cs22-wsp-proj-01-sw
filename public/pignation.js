const listArray = []
for (let i = 0; i < 40; i++) {
	listArray.push(`<li class="list-group-item">${i}</li>`)
}

const numberOfItems = listArray.length
const itemsPerPage = 4
const currentPage = 1
const numberOfPages = Math.ceil(itemsPerPage / numberPerPage)
