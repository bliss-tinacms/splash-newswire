export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const BlogPartsFragmentDoc = gql`
    fragment BlogParts on Blog {
  __typename
  title
  permalink
  description
  seo {
    __typename
    metaTitle
    metaDescription
    ogTitle
    ogDescription
    ogImage
    canonicalUrl
    noindex
    nofollow
  }
  pubDate
  updatedDate
  category {
    ... on Category {
      __typename
      title
      description
    }
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
  }
  author {
    ... on User {
      __typename
      name
      role
      avatar
      bio
      email
    }
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
  }
  heroImage
  authorAlt
  heroImageAlt
  body
}
    `;
export const CategoryPartsFragmentDoc = gql`
    fragment CategoryParts on Category {
  __typename
  title
  description
}
    `;
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  title
  seoTitle
  permalink
  seo {
    __typename
    metaTitle
    metaDescription
    ogTitle
    ogDescription
    ogImage
    canonicalUrl
    noindex
    nofollow
  }
  blocks {
    __typename
    ... on PageBlocksHero {
      headline
      tagline
      actions {
        __typename
        label
        type
        icon
        link
      }
      image {
        __typename
        src
        alt
      }
      starfield
    }
    ... on PageBlocksCallout {
      text
      url
    }
    ... on PageBlocksFeatures {
      title
      description
      items {
        __typename
        icon
        title
        text
      }
    }
    ... on PageBlocksStats {
      title
      description
      stats {
        __typename
        stat
        type
      }
    }
    ... on PageBlocksCta {
      title
      description
      actions {
        __typename
        label
        type
        icon
        link
      }
    }
    ... on PageBlocksContent {
      body
    }
    ... on PageBlocksTestimonial {
      title
      description
      testimonials {
        __typename
        quote
        author
        role
        avatar
      }
    }
    ... on PageBlocksVideo {
      url
      autoPlay
      loop
    }
    ... on PageBlocksSplit {
      title
      body
      image {
        __typename
        src
        alt
      }
      reverse
      actions {
        __typename
        label
        type
        icon
        link
      }
    }
  }
}
    `;
export const UserPartsFragmentDoc = gql`
    fragment UserParts on User {
  __typename
  name
  role
  avatar
  bio
  email
}
    `;
export const NavigationPartsFragmentDoc = gql`
    fragment NavigationParts on Navigation {
  __typename
  title
  items {
    __typename
    label
    href
    children {
      __typename
      label
      href
    }
  }
}
    `;
export const ConfigPartsFragmentDoc = gql`
    fragment ConfigParts on Config {
  __typename
  seo {
    __typename
    title
    description
    siteOwner
    logo
    footerLogo
  }
  contactForm {
    __typename
    formspreeEndpoint
    heading
    description
    buttonText
    note
    subject
  }
  codeInjection {
    __typename
    headerCode
    footerCode
  }
  contactLinks {
    __typename
    title
    link
    icon
  }
  footerStarfield
}
    `;
export const BlogDocument = gql`
    query blog($relativePath: String!) {
  blog(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BlogParts
  }
}
    ${BlogPartsFragmentDoc}`;
export const BlogConnectionDocument = gql`
    query blogConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BlogFilter) {
  blogConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BlogParts
      }
    }
  }
}
    ${BlogPartsFragmentDoc}`;
export const CategoryDocument = gql`
    query category($relativePath: String!) {
  category(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CategoryParts
  }
}
    ${CategoryPartsFragmentDoc}`;
export const CategoryConnectionDocument = gql`
    query categoryConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CategoryFilter) {
  categoryConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CategoryParts
      }
    }
  }
}
    ${CategoryPartsFragmentDoc}`;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export const UserDocument = gql`
    query user($relativePath: String!) {
  user(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export const UserConnectionDocument = gql`
    query userConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: UserFilter) {
  userConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...UserParts
      }
    }
  }
}
    ${UserPartsFragmentDoc}`;
export const NavigationDocument = gql`
    query navigation($relativePath: String!) {
  navigation(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...NavigationParts
  }
}
    ${NavigationPartsFragmentDoc}`;
export const NavigationConnectionDocument = gql`
    query navigationConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: NavigationFilter) {
  navigationConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...NavigationParts
      }
    }
  }
}
    ${NavigationPartsFragmentDoc}`;
export const ConfigDocument = gql`
    query config($relativePath: String!) {
  config(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConfigParts
  }
}
    ${ConfigPartsFragmentDoc}`;
export const ConfigConnectionDocument = gql`
    query configConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConfigFilter) {
  configConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConfigParts
      }
    }
  }
}
    ${ConfigPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    blog(variables, options) {
      return requester(BlogDocument, variables, options);
    },
    blogConnection(variables, options) {
      return requester(BlogConnectionDocument, variables, options);
    },
    category(variables, options) {
      return requester(CategoryDocument, variables, options);
    },
    categoryConnection(variables, options) {
      return requester(CategoryConnectionDocument, variables, options);
    },
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    user(variables, options) {
      return requester(UserDocument, variables, options);
    },
    userConnection(variables, options) {
      return requester(UserConnectionDocument, variables, options);
    },
    navigation(variables, options) {
      return requester(NavigationDocument, variables, options);
    },
    navigationConnection(variables, options) {
      return requester(NavigationConnectionDocument, variables, options);
    },
    config(variables, options) {
      return requester(ConfigDocument, variables, options);
    },
    configConnection(variables, options) {
      return requester(ConfigConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};

;/* HERMES_TINA_VIEW_LINKS_START */
if (typeof window !== "undefined") { try { (function () {
  if (window.__splashTinaViewLinksLoaded) return;
  window.__splashTinaViewLinksLoaded = true;
  var LINK_CLASS = 'splash-tina-row-view-link';
  var STYLE_ID = 'splash-tina-row-view-link-style';

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.' + LINK_CLASS + '{display:inline-flex!important;align-items:center!important;margin-left:10px!important;padding:2px 8px!important;border-radius:6px!important;background:#eff6ff!important;border:1px solid #bfdbfe!important;color:#1d4ed8!important;font-size:12px!important;font-weight:700!important;line-height:1.4!important;text-decoration:none!important;vertical-align:middle!important;position:relative!important;z-index:9999!important;}' +
      '.' + LINK_CLASS + ':hover{background:#dbeafe!important;color:#1e40af!important;text-decoration:none!important;}';
    document.head.appendChild(style);
  }

  function text(el) { return (el && el.textContent ? el.textContent : '').replace(/s+/g, ' ').trim(); }
  function slugify(value) {
    return String(value || '').toLowerCase().replace(/\/g, '/').replace(/^/+|/+$/g, '').replace(/.(mdx?|json)$/i, '').split('/').map(function (part) {
      return part.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }).filter(Boolean).join('/');
  }
  function activeCollection() {
    var url = location.href.toLowerCase();
    var body = text(document.body);
    if (url.indexOf('blog') !== -1 || /(^|s)Blogs(s|$)/.test(body)) return 'blog';
    if (url.indexOf('page') !== -1 || /(^|s)Pages(s|$)/.test(body)) return 'page';
    return null;
  }
  function rowCells(row) {
    var cells = Array.prototype.slice.call(row.querySelectorAll('td,[role="cell"]'));
    if (cells.length) return cells;
    var kids = Array.prototype.slice.call(row.children || []).filter(function (el) { return text(el); });
    return kids;
  }
  function urlFromPath(rowText) {
    rowText = String(rowText || '').replace(/\/g, '/');
    var b = rowText.match(/src/content/blog/([^s]+?).(mdx?|json)/i);
    if (b) return '/blog/' + slugify(b[1]) + '/';
    var p = rowText.match(/src/content/page/([^s]+?).(mdx?|json)/i);
    if (p) {
      var ps = slugify(p[1]);
      return (!ps || ps === 'home' || ps === 'index') ? '/' : '/' + ps + '/';
    }
    return null;
  }
  function urlFromRow(row) {
    var rowText = text(row);
    if (/Titles+Filenames+Extensions+Template/i.test(rowText)) return null;
    var direct = urlFromPath(rowText);
    if (direct) return direct;
    var collection = activeCollection();
    if (!collection) return null;
    var cells = rowCells(row);
    var filename = '';
    if (cells.length >= 4) filename = text(cells[1]);
    if (!filename || /filename/i.test(filename)) {
      var match = rowText.match(/([A-Za-z0-9][A-Za-z0-9_-]*)s+.mdx/);
      if (match) filename = match[1];
    }
    var slug = slugify(filename);
    if (!slug || slug === 'filename' || slug === 'extension' || slug === 'template') return null;
    return collection === 'blog' ? '/blog/' + slug + '/' : ((slug === 'home' || slug === 'index') ? '/' : '/' + slug + '/');
  }
  function bestTarget(row) {
    var cells = rowCells(row);
    if (cells.length >= 4 && !/filename/i.test(text(cells[1]))) return cells[1];
    var pathLine = Array.prototype.slice.call(row.querySelectorAll('*')).find(function (el) { return /src/content/(blog|page)//i.test(text(el)); });
    return pathLine || cells[0] || row;
  }
  function collectRows() {
    var rows = Array.prototype.slice.call(document.querySelectorAll('tr,[role="row"]'));
    if (rows.length) return rows;
    var candidates = Array.prototype.slice.call(document.querySelectorAll('main div, main a'));
    var seen = [];
    candidates.forEach(function (el) {
      var t = text(el);
      if (/src/content/(blog|page)//i.test(t) || /.mdx/i.test(t)) {
        var row = el.closest('[class*="row"],[role="row"],tr') || el.parentElement || el;
        if (seen.indexOf(row) === -1) seen.push(row);
      }
    });
    return seen;
  }
  function inject() {
    addStyle();
    collectRows().forEach(function (row) {
      if (!row || row.querySelector('.' + LINK_CLASS)) return;
      var url = urlFromRow(row);
      if (!url) return;
      var a = document.createElement('a');
      a.className = LINK_CLASS;
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'View';
      a.title = 'Open frontend: ' + url;
      a.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); window.open(url, '_blank', 'noopener,noreferrer'); });
      var target = bestTarget(row);
      target.appendChild(document.createTextNode(' '));
      target.appendChild(a);
    });
  }
  var timer = null;
  function schedule(){ clearTimeout(timer); timer = setTimeout(inject, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule); else schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  setInterval(inject, 700);
  console.log('[Splash Tina View Links] loaded');
})(); } catch (e) { console.warn("Splash Tina View Links failed", e); } }
/* HERMES_TINA_VIEW_LINKS_END */
