import React from "react";
import styles from "./ProductItemSkeleton.module.css";

const ProductItemSkeleton: React.FC = () => {
  return (
    <li className={styles.skeletonItem}>
      <div className={styles.skeletonTextLarge}></div>
      <div className={styles.skeletonRow}>
        <div className={styles.skeletonTextSmall}></div>
        <div className={styles.skeletonTextSmall}></div>
      </div>
      <div className={styles.skeletonButtonRow}>
        <div className={styles.skeletonButton}></div>
        <div className={styles.skeletonButton}></div>
      </div>
    </li>
  );
};

export default ProductItemSkeleton;
