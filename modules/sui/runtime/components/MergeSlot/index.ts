import { Comment, cloneVNode, defineComponent, mergeProps } from 'vue';
import { Fragment, type VNode } from 'vue';

function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) return [];
  return children.flatMap((child) => {
    if (child.type === Fragment) return renderSlotFragments(child.children as VNode[]);

    return [child];
  });
}

export const VSlotMerge = defineComponent({
  name: 'VSlotMerge',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null;

      const childrens = renderSlotFragments(slots.default());
      const firstNonCommentChildrenIndex = childrens.findIndex(
        (child) => child.type !== Comment
      );
      if (firstNonCommentChildrenIndex === -1) return childrens;

      const firstNonCommentChildren = childrens[firstNonCommentChildrenIndex];

      // remove props ref from being inferred
      delete firstNonCommentChildren.props?.ref;

      const mergedProps = firstNonCommentChildren.props
        ? mergeProps(attrs, firstNonCommentChildren.props)
        : attrs;
      // remove class to prevent duplicated
      if (attrs.class && firstNonCommentChildren.props?.class)
        delete firstNonCommentChildren.props.class;
      const cloned = cloneVNode(firstNonCommentChildren, mergedProps);

      // Explicitly override props starting with `on`.
      // It seems cloneVNode from Vue doesn't like overriding `onXXX` props.
      // So we have to do it manually.
      for (const prop in mergedProps) {
        if (prop.startsWith('on')) {
          cloned.props ||= {};
          cloned.props[prop] = mergedProps[prop];
        }
      }

      if (childrens.length === 1) return cloned;

      childrens[firstNonCommentChildrenIndex] = cloned;
      return childrens;
    };
  },
});
