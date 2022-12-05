const productsData = [
    {
        name: 'Educative',
        description: 'Interactive Courses for Software Developers',
        url: 'https://educative.io/',
        numberOfVotes: 10,
        publishedAt: '2021-04-05',
        authorId: '1',
         // This product belongs to the "Education" category
        categoriesIds: ['1']
      },
      {
        name: 'Apollo',
        description: 'The Apollo Data Graph Platform',
        url: 'https://www.apollographql.com/',
        numberOfVotes: 5,
        publishedAt: '2021-01-08',
        authorId: '2',
        // This product belongs to the "Frameworks" and "API" categories
        categoriesIds: ['2', '3']
      },
      {
        name: 'OneGraph',
        description: 'Build Integrations 100x Faster',
        url: 'https://www.onegraph.com',
        numberOfVotes: 5,
        publishedAt: '2020-08-22',
        authorId: '1',
         // This product belongs to the "API" category
        categoriesIds: ['3']
      },
]
/*
 we could have embedded userData object in productsData doing that way would have saved effort in updating resolvers to add new resolver. 
 but embedding an object within another object is not a good practice. If we want to make a change in nested object then we would need to change all parent objects where updated object is embedded.
 Instead, better approach is to seperate the objects out- like in this case we an object for Product and User, this way if we need to update any object in future then we only update it in one place.
 with seperate objects we can refer id of one object into another instead of embedding full object- like in this case we embedded autherId in ProductsData..
 we will add a resolver to let Appolo Server know how to fetch user data when allProducts query is called. 
 think of 2 seperate objects like having 2 seperate collections in MongoDB or 2 seperate tables in relational DB 
 */
const userData = [
    {
        id: '1',
        userName: 'ellen',
        fullName: 'Ellen James'
      },
      {
        id: '2',
        userName: 'peter',
        fullName: 'Peter Miles'
      },
]

const categoriesData = [
    {
      id: '1',
      slug: 'education',
      name: 'Education',
    },
    {
      id: '2',
      slug: 'frameworks',
      name: 'Frameworks',
    },
    {
      id: '3',
      slug: 'api',
      name: 'API',
    },
  ]

const resolvers = {
    Query: {
      appName: () =>
        'ProductHunt clone',

      allProducts: () => {
        console.log('Query.allProducts')
        return productsData
     },
     //query to get all products for a single user
     productsByAuthor: (_, { authorName }) => { // Extract "authorName" from arguments- this technique is called object destructing.
        //Instead of using the args parameter, we use object destructing to extract the value of the authorName argument from it immediately. 
        const user = userData.find(user => user.userName === authorName)
        return productsData.filter(product => product.authorId === user.id)
      },

      productsByCategory: (_, {slug}) => {
        const category = categoriesData.find(category => category.slug===slug)
        return productsData.filter(product => product.categoriesIds.includes(category.id))

      }
  },

   // Specifies how to get fields for the "Product" type
   Product: {
    //Each function in this object specifies how to get data for fields queried on the Product type. 
    //In this case we're only defining function to fetch author for a product
    author: (product) => {
        console.log(`Query.Product.author for "${product.name}"`)
        return userData.find(user => user.id===product.authorId)
      },

      categories: (product) => {
        const res =  product.categoriesIds.map(categoryId => {
            return categoriesData.find(category => category.id === categoryId )
          })
    
          return res
      },
  },
}
  
  module.exports = {
    resolvers
  }